import { Router } from 'express';
import { createBooking } from '../Booking/booking.controller';
import { authMiddleware } from '../../../middleware/authMiddleware';

const router = Router();

router.post('/', authMiddleware, createBooking);

export default router;
