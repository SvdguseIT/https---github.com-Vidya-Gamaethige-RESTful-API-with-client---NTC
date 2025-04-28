const operatorMiddleware = (req, res, next) => {
    if (req.user.role !== 'operator') {
      return res.status(403).json({ error: 'Access denied. Operator privileges required.' });
    }
    next();
  };
  
  module.exports = { operatorMiddleware };
  