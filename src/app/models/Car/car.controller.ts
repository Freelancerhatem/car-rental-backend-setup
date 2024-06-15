import { ZodError } from "zod";
import { handleError } from "../../../utils/handleError";
import { carSchema } from "./car.validation";
import Car from "./car.model";
import { Request, Response } from "express";

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
    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json(handleError(error));
        }
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
    } catch (error: any) {
        res.status(500).json({ success: false, message: error.message });
    }
};