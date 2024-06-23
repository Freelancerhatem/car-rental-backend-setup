import authRoutes from '../../app/models/User/user.route';
import carRoutes from '../../app/models/Car/car.route';
import bookingRoutes from '../../app/models/Booking/booking.route';

const routes = [
    {
        path: '/api/auth',
        router: authRoutes
    },
    {
        path: '/api/cars',
        router: carRoutes
    },
    {
        path: '/api/bookings',
        router: bookingRoutes
    }
];

export default routes;
