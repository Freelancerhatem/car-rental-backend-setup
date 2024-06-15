import express from 'express';

const router = express.Router();

router.route('/').post(protect, createCar).get(getAllCars);

// Add other routes for car (getCar, updateCar, deleteCar)

export default router;