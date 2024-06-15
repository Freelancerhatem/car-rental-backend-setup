import { ZodError } from 'zod';

export const handleError = (error: ZodError) => {
    const errors = error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
    }));

    return {
        success: false,
        statusCode: 400,
        message: 'Validation Error',
        errors,
    };
};
