import { ZodError } from "zod";
import { handleError } from "../../../utils/handleError";
import { carSchema, updateCarSchema } from "./car.validation";
import Car from "./car.model";
import { Request, Response } from "express";
import { CustomError } from "../../../error/customError";
import { Document, Types } from "mongoose";
import { TCar } from "./car.interface";
import calculateHours from "../../../utils/totalPrice";
import Booking from "../Booking/booking.model";

export const createCar = async (req: Request, res: Response) => {
    try {
        const validatedData = carSchema.parse(req.body);
        const car = await Car.create(validatedData);
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'Car created successfully',
            data: car,
        });
    } catch (error: unknown) {
        if (error instanceof ZodError) {
            return res.status(400).json(handleError(error));
        }
        else if (error instanceof CustomError)
            res.status(500).json({ success: false, message: error.message });
    }
};

export const getAllCars = async (req: Request, res: Response) => {
    try {
        const cars = await Car.find({ isDeleted: false });
        if (!cars.length) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: 'No data found',
                data: [],
            });
        }
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'Cars retrieved successfully',
            data: cars,
        });
    } catch (error: unknown) {
        if (error instanceof CustomError)
            res.status(500).json({ success: false, message: error.message });
    }

};
export const getCar = async (req: Request, res: Response) => {
    const { id } = req.params
    const car = await Car.findById({ _id: id })
    try {
        if (!car) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "No Car Found"
            })
        }
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "A car retrieved successfully",
            data: car
        })
    }
    catch (error: unknown) {
        if (error instanceof CustomError)
            res.status(500).json({ success: false, message: error.message });
    }
}

export const updateCar = async (req: Request, res: Response) => {
    try {
        const validatedData = updateCarSchema.parse(req.body)
        const updatedCar = await Car.findByIdAndUpdate(req.params.id, validatedData, {
            new: true,
            runValidators: true
        })
        if (!updatedCar) {
            return res.status(404).json({
                success: false,
                statusCode: 404,
                message: "No Car Found"
            })
        }
        res.status(200).json({
            success: true,
            statusCode: 200,
            message: "car updated successfully",
            data: updatedCar
        })
    }
    catch (error: unknown) {
        if (error instanceof CustomError)
            res.status(500).json({ success: false, message: error.message });
    }
}
export const deleteCar = async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const CheckIsDeleted = await Car.findById(id, 'isDeleted');
        console.log(CheckIsDeleted);
        if (CheckIsDeleted) {

            if (!CheckIsDeleted.isDeleted as boolean) {

                const findAndDelete = await Car.findByIdAndUpdate(id, { isDeleted: true }, { new: true });
                if (!findAndDelete) {
                    res.status(404).json({
                        success: false,
                        status: 404,
                        message: 'No Car Found',
                        data: 'findAndDelete'

                    })
                }
                res.status(200).json({
                    success: true,
                    status: 200,
                    message: 'Car Deleted Successfully',
                    data: findAndDelete
                })
            }
            else {
                res.status(500).json({
                    success: false,
                    status: 500,
                    message: 'Car Already Deleted',
                    data: null
                })
            }
        }


    }
    catch (error: unknown) {
        if (error instanceof CustomError)
            res.status(500).json({ success: false, message: error.message });
    }
}

export const returnBookingByAdmin = async (req: Request, res: Response) => {
    try {
        const { bookingId, endTime } = req.body;
        if (!bookingId || !endTime) {
            return res.status(400).json({
                success: false,
                message: 'Booking ID and endTime are required in the request body',
            });
        }
        const booking = await Booking.findById(bookingId).populate('car');

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found',
            });
        }
        const startTime = booking.startTime
        booking.endTime = endTime;
        const totalTime = calculateHours(startTime, endTime);



        const carData: (Document<unknown, TCar> & TCar & {
            _id: Types.ObjectId;
        }) | null = await Car.findById(booking.car);

        const totalCost = totalTime * carData?.pricePerHour
        booking.totalCost = totalCost;
        booking.updatedAt = new Date();

        carData.status = 'available';


        await booking.save();
        await carData.save();


        res.status(200).json({
            success: true,
            message: 'Car returned successfully',
            data: booking,
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

}