const Bus = require('../models/Bus'); 
const Route = require('../models/Route'); 
const Trip = require('../models/Trip'); 
const User = require('../models/User'); 
const bcrypt = require('bcryptjs');

exports.getAllBuses = async (req, res) => {
    try {
        const buses = await Bus.find().populate('routeId', 'number start end'); // Populate route details
        res.status(200).json(buses);
    } catch (error) {
        console.error('Error fetching buses:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.addBus = async (req, res) => {
    const { ntcNo, busNo, driverId, conductorId, busType, busName, routeId } = req.body;

    try {
      
        const existingBus = await Bus.findOne({ ntcNo });
        if (existingBus) {
            return res.status(400).json({ error: 'Bus with this NTC number already exists.' });
        }

        const bus = new Bus({
            ntcNo,
            busNo,
            driverId,
            conductorId,
            busType,
            busName,
            routeId,
        });

        await bus.save();
        res.status(201).json({ message: 'Bus added successfully', bus });
    } catch (error) {
        console.error('Error adding bus:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateBusByNtcNo = async (req, res) => {
    const { ntcNo } = req.params;
    const updates = req.body;

    try {
        const updatedBus = await Bus.findOneAndUpdate({ ntcNo }, updates, { new: true });
        if (!updatedBus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.status(200).json({ message: 'Bus updated successfully', bus: updatedBus });
    } catch (error) {
        console.error('Error updating bus:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getBusByNtcNo = async (req, res) => {
    const { ntcNo } = req.params;

    try {
        const bus = await Bus.findOne({ ntcNo }).populate('routeId', 'number start end');
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.status(200).json(bus);
    } catch (error) {
        console.error('Error fetching bus:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteBusByNtcNo = async (req, res) => {
    const { ntcNo } = req.params;

    try {
        const deletedBus = await Bus.findOneAndDelete({ ntcNo });
        if (!deletedBus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        res.status(200).json({ message: 'Bus deleted successfully' });
    } catch (error) {
        console.error('Error deleting bus:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.searchRoutes = async (req, res) => {
    const { routeId, start, end } = req.query;

    try {
        const query = {};
        if (routeId) query._id = routeId;
        if (start) query.start = start;
        if (end) query.end = end;

        const routes = await Route.find(query);
        res.status(200).json(routes);
    } catch (error) {
        console.error('Error searching routes:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.createRoute = async (req, res) => {
    const { number, start, end, totalDistance } = req.body;

    try {
        const existingRoute = await Route.findOne({ number });
        if (existingRoute) {
            return res.status(400).json({ error: 'Route number already exists' });
        }
        const route = new Route({ number, start, end, totalDistance });
        await route.save();

        res.status(201).json({ message: 'Route created successfully', route });
    } catch (error) {
        console.error('Error creating route:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};


exports.updateRoute = async (req, res) => {
    const { id } = req.params;
    const updates = req.body;

    try {
        const updatedRoute = await Route.findByIdAndUpdate(id, updates, { new: true });
        if (!updatedRoute) {
            return res.status(404).json({ error: 'Route not found' });
        }
        res.status(200).json({ message: 'Route updated successfully', route: updatedRoute });
    } catch (error) {
        console.error('Error updating route:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteRoute = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedRoute = await Route.findByIdAndDelete(id);
        if (!deletedRoute) {
            return res.status(404).json({ error: 'Route not found' });
        }
        res.status(200).json({ message: 'Route deleted successfully' });
    } catch (error) {
        console.error('Error deleting route:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.addTrip = async (req, res) => {
    const { tripId, routeId, busId, startTime, endTime, date, totalSeats } = req.body;

    try {
        const route = await Route.findById(routeId);
        if (!route) {
            return res.status(404).json({ error: 'Route not found' });
        }
        const bus = await Bus.findById(busId);
        if (!bus) {
            return res.status(404).json({ error: 'Bus not found' });
        }
        const existingTrip = await Trip.findOne({ tripId });
        if (existingTrip) {
            return res.status(400).json({ error: 'Trip with this ID already exists' });
        }

     
        const trip = new Trip({
            tripId,
            routeId,
            busId,
            startTime,
            endTime,
            date,
            totalSeats,
            availableSeats: totalSeats,
            bookedSeats: [],
            notProvidedSeats: [],
        });

        await trip.save();
        res.status(201).json({ message: 'Trip added successfully', trip });
    } catch (error) {
        console.error('Error adding trip:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.getAllTrips = async (req, res) => {
    try {
        const trips = await Trip.find()
            .populate('routeId', 'number start end')
            .populate('busId', 'ntcNo busNo busName');
        res.status(200).json(trips);
    } catch (error) {
        console.error('Error fetching trips:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.cancelTrip = async (req, res) => {
    const { tripId } = req.params; 

    try {
        const trip = await Trip.findOne({ tripId });
        if (!trip) {
            return res.status(404).json({ error: 'Trip not found' });
        }

        trip.status = 'cancelled';
        await trip.save();

        res.status(200).json({ message: 'Trip canceled successfully', trip });
    } catch (error) {
        console.error('Error canceling trip:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateTrip = async (req, res) => {
    const { tripId } = req.params; 
    const updates = req.body;

    try {
        const updatedTrip = await Trip.findOneAndUpdate({ tripId }, updates, { new: true });
        if (!updatedTrip) {
            return res.status(404).json({ error: 'Trip not found' });
        }
        res.status(200).json({ message: 'Trip updated successfully', trip: updatedTrip });
    } catch (error) {
        console.error('Error updating trip:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.addOperator = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the operator already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'Operator with this email already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        const operator = new User({
            email,
            password: hashedPassword,
            role: 'operator', 
        });

        await operator.save();
        res.status(201).json({ message: 'Operator added successfully', operator });
    } catch (error) {
        console.error('Error adding operator:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.deleteOperator = async (req, res) => {
    const { id } = req.params; // Operator's ID

    try {
        const deletedOperator = await User.findOneAndDelete({ _id: id, role: 'operator' });

        if (!deletedOperator) {
            return res.status(404).json({ error: 'Operator not found' });
        }

        res.status(200).json({ message: 'Operator deleted successfully' });
    } catch (error) {
        console.error('Error deleting operator:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

exports.updateOperator = async (req, res) => {
    const { id } = req.params; // Operator's ID
    const updates = req.body;

    try {
        const updatedOperator = await User.findOneAndUpdate(
            { _id: id, role: 'operator' }, 
            updates,
            { new: true }
        );

        if (!updatedOperator) {
            return res.status(404).json({ error: 'Operator not found' });
        }

        res.status(200).json({ message: 'Operator updated successfully', operator: updatedOperator });
    } catch (error) {
        console.error('Error updating operator:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};



