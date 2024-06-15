import { Request, Response } from "express";
import Car from "../Car/car.model";
import Booking from "./booking.model";


export const createBooking = async (req: Request, res: Response) => {
    const { carId, date, startTime } = req.body;
    const userId = req.user?.id;

    try {
        const car = await Car.findById(carId);
        if (!car || car.isDeleted || car.status !== 'available') {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Car is not available for booking"
            });
        }

        const booking = new Booking({ car: carId, user: userId, date, startTime });
        car.status = 'unavailable';
        await booking.save();
        await car.save();

        res.status(201).json({
            success: true,
            statusCode: 201,
            message: "Booking created successfully",
            data: booking
        });
    } catch (error: any) {
        res.status(400).json({
            success: false,
            statusCode: 400,
            message: error.message,
            errorMessages: [{ path: '', message: error.message }],
            stack: error.stack
        });
    }
};

