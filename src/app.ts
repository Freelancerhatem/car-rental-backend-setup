import express, { Application, Request, Response } from 'express';
import authRoutes from './app/models/User/user.route';
import carRoutes from './app/models/Car/car.route';
import bookingRoutes from './app/models/Booking/';

import cors from 'cors'
const app: Application = express()
const port = 3000

//parser
app.use(express.json())
app.use(cors())
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})
app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/bookings', bookingRoutes);

app.use(errorHandler);

export default app