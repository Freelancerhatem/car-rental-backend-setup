import express from 'express';
import { createCar, getAllCars } from '../Car/car.controller';
import { authMiddleware } from './../../../middleware/authMiddleware';

const router = express.Router();

router.route('/').post(authMiddleware, createCar).get(getAllCars);


export default router;
