const Bus = require('../models/Bus');
const Trip = require('../models/Trip');
const User = require('../models/User');

// Operator - View My Buses
exports.getMyBuses = async (req, res) => {
  try {
    const operatorId = req.user._id; // Get current logged-in operator

    const buses = await Bus.find({ driverId: operatorId.toString() }).populate('routeId', 'number start end');

    res.status(200).json(buses);
  } catch (error) {
    console.error('Error fetching operator buses:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};

// Operator - View My Trips
exports.getMyTrips = async (req, res) => {
  try {
    const operatorId = req.user._id;

    const buses = await Bus.find({ driverId: operatorId.toString() });
    const busIds = buses.map(bus => bus._id);

    const trips = await Trip.find({ busId: { $in: busIds } })
      .populate('routeId', 'number start end')
      .populate('busId', 'ntcNo busNo busName');

    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching operator trips:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
};
