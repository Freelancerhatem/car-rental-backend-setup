import { ObjectId } from "mongoose";

export type TUser = {
    _id: ObjectId
    name: string;
    email: string;
    role: 'user' | 'admin';
    password: string;
    phone: string;
    address: string;
    comparePassword: (password: string) => Promise<boolean>;
}