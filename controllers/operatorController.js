const Bus = require('../models/Bus');
const Trip = require('../models/Trip');

// Operator - View Trips assigned to the operator
exports.getOperatorTrips = async (req, res) => {
  try {
    const operatorId = req.user._id; // Current logged-in operator

    // Find all buses driven by this operator
    const buses = await Bus.find({ driverId: operatorId.toString() });
    const busIds = buses.map(bus => bus._id);

    // Find trips assigned to buses
    const trips = await Trip.find({ busId: { $in: busIds } })
      .populate('routeId', 'number start end')
      .populate('busId', 'ntcNo busNo busName');

    res.status(200).json(trips);
  } catch (error) {
    console.error('Error fetching operator trips:', error.message);
    res.status(500).json({ error: 'Server error fetching trips' });
  }
};

// Operator - Update Trip Status
exports.updateTripStatus = async (req, res) => {
  try {
    const { tripId } = req.params;
    const { status } = req.body;

    const allowedStatuses = ['completed', 'cancelled'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const trip = await Trip.findOne({ tripId });
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    trip.status = status;
    await trip.save();

    res.status(200).json({ message: 'Trip status updated successfully', trip });
  } catch (error) {
    console.error('Error updating trip status:', error.message);
    res.status(500).json({ error: 'Server error updating trip status' });
  }
};
