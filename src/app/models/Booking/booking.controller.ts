import { Request, Response } from "express";
import Car from "../Car/car.model";
import Booking from "./booking.model";
import { CustomError } from "../../../error/customError";
import User from "../User/user.model";


export const createBooking = async (req: Request, res: Response) => {
    const { carId, date, startTime } = req.body;
    const userEmail = req.user?.email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    if (!user) {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: "Unauthorized: User not authenticated",
        });
    }

    try {
        const car = await Car.findById(carId);

        if (!car || car.isDeleted || car.status !== 'available') {
            return res.status(400).json({
                success: false,
                statusCode: 400,
                message: "Car is not available for booking"
            });
        }

        const booking = new Booking({ car: carId, user: user._id, date, startTime });
        car.status = 'unavailable';
        await booking.save();
        await car.save();

        await booking.populate('user');
        await booking.populate('car');

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Car booked successfully',
            data: booking
        });
    }
    catch (error: unknown) {
        if (error instanceof CustomError) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: error.message,
                errorMessages: [{ path: '', message: error.message }],
                stack: error.stack
            });
        } else {
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'An unexpected error occurred',
                errorMessages: [{ path: '', message: 'An unexpected error occurred' }],
                stack: error instanceof Error ? error.stack : ''
            });
        }
    }

};

export const getUserBookings = async (req: Request, res: Response) => {
    try {
        const userId = req.user?._id
        const bookings = await Booking.find({ user: userId }).populate({
            path: 'user',
            select: '-password'
        }).populate('car');


        if (bookings.length === 0) {
            return res.status(404).json({ success: false, message: 'No bookings found' });
        }
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Bookings retrieved successfully',
            data: bookings,
        });
    } catch (error: unknown) {
        if (error instanceof CustomError) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: error.message,
                errorMessages: [{ path: '', message: error.message }],
                stack: error.stack
            });
        } else {
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'An unexpected error occurred',
                errorMessages: [{ path: '', message: 'An unexpected error occurred' }],
                stack: error instanceof Error ? error.stack : ''
            });
        }
    }
};
export const getAllBookings = async (req: Request, res: Response) => {
    try {

        const { carId, date } = req.query;

        const allBookings = await Booking.find({ car: carId, date }).populate({ path: 'user', select: "-password" }).populate('car')
        if (allBookings.length === 0) {
            return res.status(404).json({ success: false, message: 'No bookings found' });
        }
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Bookings retrieved successfully',
            data: allBookings,
        });

    }
    catch (error: unknown) {
        if (error instanceof CustomError) {
            res.status(400).json({
                success: false,
                statusCode: 400,
                message: error.message,
                errorMessages: [{ path: '', message: error.message }],
                stack: error.stack
            });
        } else {
            res.status(500).json({
                success: false,
                statusCode: 500,
                message: 'An unexpected error occurred',
                errorMessages: [{ path: '', message: 'An unexpected error occurred' }],
                stack: error instanceof Error ? error.stack : ''
            });
        }
    }
}




