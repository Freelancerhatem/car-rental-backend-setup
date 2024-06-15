import { z } from "zod";

export const signupSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    role: z.enum(['user', 'admin']),
    password: z.string().min(6),
    phone: z.string(),
    address: z.string(),
});

export const signinSchema = z.object({
    email: z.string().email(),
    password: z.string(),
});