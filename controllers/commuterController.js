const Trip = require('../models/Trip');
const Booking = require('../models/Booking');

// Book a seat
exports.bookSeat = async (req, res) => {
  const { tripId, seatNumber } = req.body;

  try {
    const trip = await Trip.findById(tripId);
    if (!trip) {
      return res.status(404).json({ error: 'Trip not found' });
    }

    if (trip.bookedSeats.includes(seatNumber)) {
      return res.status(400).json({ error: 'Seat already booked' });
    }

    if (seatNumber > trip.totalSeats || seatNumber <= 0) {
      return res.status(400).json({ error: 'Invalid seat number' });
    }

    // Update trip data
    trip.bookedSeats.push(seatNumber);
    trip.availableSeats -= 1;
    await trip.save();

    // Create a booking record
    const booking = new Booking({
      bookingId: `BOOK-${Date.now()}`,
      tripId: trip._id,
      userId: req.user._id,
      seatNumber,
      paymentStatus: 'pending',
    });

    await booking.save();

    res.status(201).json({ message: 'Seat booked successfully', booking });
  } catch (error) {
    console.error('Booking Error:', error.message);
    res.status(500).json({ error: 'Server error during booking' });
  }
};

// View my bookings
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: 'tripId',
        populate: {
          path: 'routeId',
          select: 'start end'
        }
      });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
};
