import { Routes } from '@angular/router';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { AdminComponent } from '../components/admin/admin.component';

export const routes: Routes = [
    { path: "calendar", component: CalendarComponent },
    { path: "admin", component: AdminComponent },
    { path: "**", redirectTo: "/calendar" }
];
