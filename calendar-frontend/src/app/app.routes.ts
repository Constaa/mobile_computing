import { Routes } from '@angular/router';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { LoginComponent } from '../components/login/login.component';
import { AdminComponent } from '../components/admin/admin.component';

export const routes: Routes = [
    { path: "calendar", component: CalendarComponent },
    { path: "login", component: LoginComponent },
    //TODO: Add route guard
    { path: "admin", component: AdminComponent },
    { path: "**", redirectTo: "/calendar" }
];
