const Trip = require('../models/Trip');
const Booking = require('../models/Booking');
const Notification = require('../models/Notification'); // 📢 Import Notification model

// ------------------- Book a Seat -------------------
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

    // Update trip
    trip.bookedSeats.push(seatNumber);
    trip.availableSeats -= 1;
    await trip.save();

    // Create booking
    const booking = new Booking({
      bookingId: `BOOK-${Date.now()}`,
      tripId: trip._id,
      userId: req.user._id,
      seatNumber,
      paymentStatus: 'pending',
    });

    await booking.save();

    // Save notification to DB
    const notification = new Notification({
      title: 'Seat Booked',
      message: `Seat ${seatNumber} booked successfully!`,
      userId: req.user._id,
      userType: 'commuter',
    });
    await notification.save();

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('new-notification', {
      type: 'booking',
      message: `Seat ${seatNumber} booked successfully for your trip!`,
      userId: req.user._id,
    });

    res.status(201).json({ message: 'Seat booked successfully', booking });
  } catch (error) {
    console.error('Booking Error:', error.message);
    res.status(500).json({ error: 'Server error during booking' });
  }
};

// ------------------- View My Bookings -------------------
exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user._id })
      .populate({
        path: 'tripId',
        populate: { path: 'routeId', select: 'start end' },
      });

    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error.message);
    res.status(500).json({ error: 'Server error fetching bookings' });
  }
};

// ------------------- Mock Payment API -------------------
exports.payBooking = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findOne({ bookingId, userId: req.user._id });
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.paymentStatus === 'confirmed') {
      return res.status(400).json({ error: 'Payment already confirmed for this booking' });
    }

    booking.paymentStatus = 'confirmed';
    await booking.save();

    // Save notification to DB
    const notification = new Notification({
      title: 'Payment Successful',
      message: `Payment confirmed for Booking ID: ${bookingId}`,
      userId: req.user._id,
      userType: 'commuter',
    });
    await notification.save();

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('new-notification', {
      type: 'payment',
      message: `Payment confirmed for Booking ID: ${bookingId}`,
      userId: req.user._id,
    });

    res.status(200).json({ message: 'Payment successful!', booking });
  } catch (error) {
    console.error('Payment Error:', error.message);
    res.status(500).json({ error: 'Server error during payment' });
  }
};

// ------------------- Cancel My Booking (NEW) -------------------
exports.cancelBooking = async (req, res) => {
  const { bookingId } = req.body;

  try {
    const booking = await Booking.findOne({ bookingId, userId: req.user._id });

    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    if (booking.paymentStatus === 'confirmed') {
      return res.status(400).json({ error: 'Cannot cancel a confirmed booking' });
    }

    // Free seat in trip
    const trip = await Trip.findById(booking.tripId);
    if (trip) {
      trip.bookedSeats = trip.bookedSeats.filter(seat => seat !== booking.seatNumber);
      trip.availableSeats += 1;
      await trip.save();
    }

    await booking.deleteOne();

    // Save notification to DB
    const notification = new Notification({
      title: 'Booking Cancelled',
      message: `Your booking (Seat ${booking.seatNumber}) has been cancelled.`,
      userId: req.user._id,
      userType: 'commuter',
    });
    await notification.save();

    // Emit real-time notification
    const io = req.app.get('io');
    io.emit('new-notification', {
      type: 'cancellation',
      message: `Your booking (Seat ${booking.seatNumber}) has been cancelled.`,
      userId: req.user._id,
    });

    res.status(200).json({ message: 'Booking canceled successfully' });
  } catch (error) {
    console.error('Cancel Booking Error:', error.message);
    res.status(500).json({ error: 'Server error during cancellation' });
  }
};

// ------------------- View My Notifications -------------------
exports.getMyNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ error: 'Server error fetching notifications' });
  }
};

