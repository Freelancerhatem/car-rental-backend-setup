import { Request } from 'express';
import { TUser } from '../app/models/User/user.interface';


declare module 'express-serve-static-core' {
    interface Request {
        user?: TUser;
    }
}
