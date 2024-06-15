import { Schema } from "mongoose";

export type TBooking = {
    date: Date;
    user: Schema.Types.ObjectId;
    car: Schema.Types.ObjectId;
    startTime: string;
    endTime: string | null;
    totalCost: number;
}