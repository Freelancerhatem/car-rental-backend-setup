import express from 'express';
import { createCar, deleteCar, getAllCars, getCar, returnBookingByAdmin, updateCar } from '../Car/car.controller';
import { protect, admin } from '../../../middleware/authMiddleware';

const router = express.Router();
router.route('/')
    .post(protect, admin, createCar)
    .get(getAllCars);

router.put('/return', protect, admin, returnBookingByAdmin)
router.route('/:id')
    .put(protect, admin, updateCar)
    .delete(protect, admin, deleteCar)
    .get(getCar)

export default router;
