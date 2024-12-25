const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User'); 

const generateToken = (user) => {
    return jwt.sign(
        { _id: user._id, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: '1h' } 
    );
};

exports.register = async (req, res) => {
    const { email, password, role } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists with this email' });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            email,
            password: hashedPassword,
            role,
        });
        await user.save();
        const token = generateToken(user);

        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Registration error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;

    try {

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        const token = generateToken(user);

        user.tokens = user.tokens.concat({ token });
        await user.save();

        res.cookie('token', token, {
            httpOnly: true,  
            secure: process.env.NODE_ENV === 'production', 
            expires: new Date(Date.now() + 3600000), 
        });

        res.status(200).json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
            },
        });
    } catch (err) {
        console.error('Login error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.logout = async (req, res) => {
    try {
        
        res.clearCookie('token', { httpOnly: true, secure: process.env.NODE_ENV === 'production' });
        const user = await User.findById(req.user._id);
        if (user) {
            user.tokens = user.tokens.filter((token) => token.token !== req.token);
            await user.save();
        }

        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error('Logout error:', err.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.authMiddleware = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '') || req.cookies.token;
        if (!token) {
            return res.status(401).json({ error: 'Access denied. No token provided.' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = await User.findById(decoded._id);
        if (!req.user) {
            return res.status(401).json({ error: 'User not found.' });
        }

        req.token = token;  
        next();
    } catch (err) {
        console.error('Authentication error:', err.message);
        res.status(401).json({ error: 'Invalid or expired token.' });
    }
};


// Middleware Commuter-Only Access
exports.commuterMiddleware = (req, res, next) => {
    if (req.user.role !== 'commuter') {
        return res.status(403).json({ error: 'Access denied. Commuter privileges required.' });
    }
    next();
};

// Middleware Role-Based Authorization (e.g., Admin Only)
exports.adminMiddleware = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied. Admin privileges required.' });
    }
    next();
};

// Middleware Operator-Only Access
exports.operatorMiddleware = (req, res, next) => {
    if (req.user.role !== 'operator') {
        return res.status(403).json({ error: 'Access denied. Operator privileges required.' });
    }
    next();
};
