import express from 'express';
import { createCar, getAllCars } from '../Car/car.controller';
import { protect } from './../../../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(protect, createCar).get(getAllCars);


export default router;
