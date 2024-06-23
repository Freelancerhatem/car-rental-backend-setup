import { z } from "zod";

const ObjectIdSchema = z.string().regex(/^[0-9a-fA-F]{24}$/, 'Invalid ObjectId format');
export const bookingSchema = z.object({
    date: z.string().or(z.date()), // Zod can handle date strings or Date objects
    user: ObjectIdSchema,
    car: ObjectIdSchema,
    startTime: z.string(),
    endTime: z.string().nullable().default(null),
    totalCost: z.number().default(0),
});