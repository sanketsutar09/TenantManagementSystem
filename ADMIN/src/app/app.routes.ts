import { Routes } from '@angular/router';
import { AdminDashboard } from './admin-dashboard/admin-dashboard';
import { PropertyDetails } from './property-details/property-details';
import { UserDetails } from './user-details/user-details';
import { AdminUploadProperty } from './admin-upload-property/admin-upload-property';
import { AdminCancelledBookings } from './admin-cancelled-bookings/admin-cancelled-bookings';
import { BookingDetails } from './booking-details/booking-details';
import { AdminDeletedPropertiies } from './admin-deleted-propertiies/admin-deleted-propertiies';
import { AdminLogin } from './admin-login/admin-login';

export const routes: Routes = [
    {
        path: '',
        component: AdminLogin
    },
    {
        path: 'admin-login',
        component: AdminLogin
    },
    {
        path: 'dashboard',
        component: AdminDashboard
    },
    {
        path: 'uploadProperty',
        component: AdminUploadProperty
    },
    {
       path: 'Properties',
       component: PropertyDetails
    },
    {
        path: 'Booking',
        component: BookingDetails
    },
    {
        path: 'Users',
        component: UserDetails
    },
    {
        path: 'cancelledBooking',
        component: AdminCancelledBookings
    },
    {
        path: 'deletedBooking',
        component: AdminDeletedPropertiies
    }
];
