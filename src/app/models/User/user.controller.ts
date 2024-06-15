import { ZodError } from "zod";
import jwt from 'jsonwebtoken';
import User from "./user.model";
import { signinSchema, signupSchema } from "./user.validation";
import { handleError } from "../../../utils/handleError";
import { Request, Response } from "express";

export const signup = async (req: Request, res: Response) => {
    try {
        const validatedData = signupSchema.parse(req.body);
        const user = await User.create(validatedData);
        res.status(201).json({
            success: true,
            statusCode: 201,
            message: 'User registered successfully',
            data: user,
        });
    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json(handleError(error));
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

export const signin = async (req: Request, res: Response) => {
    try {
        const { email, password } = signinSchema.parse(req.body);
        const user = await User.findOne({ email });

        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({
                success: false,
                statusCode: 401,
                message: 'Invalid email or password',
            });
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET!, {
            expiresIn: '1d',
        });

        res.status(200).json({
            success: true,
            statusCode: 200,
            message: 'User logged in successfully',
            data: user,
            token,
        });
    } catch (error: any) {
        if (error instanceof ZodError) {
            return res.status(400).json(handleError(error));
        }
        res.status(500).json({ success: false, message: error.message });
    }
};