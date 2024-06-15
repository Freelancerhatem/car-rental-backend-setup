import { Schema, model } from "mongoose";
import { TUser } from "./user.interface";
import bcrypt from 'bcryptjs';

const userSchema = new Schema<TUser>({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },

},
    { timestamps: true }
)

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});
userSchema.methods.comparePassword = async function (password: string) {
    return await bcrypt.compare(password, this.password);
};

const User = model<TUser>('User', userSchema);

export default User;