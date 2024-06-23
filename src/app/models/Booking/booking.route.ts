import { Router } from 'express';
import { createBooking, getAllBookings, getUserBookings } from '../Booking/booking.controller';
import { admin, protect, user } from '../../../middleware/authMiddleware';

const router = Router();

router.route('/')
    .post(protect, user, createBooking)
    .get(protect, admin, getAllBookings);
router.get('/my-bookings', protect, user, getUserBookings);


export default router;
