import { Routes } from '@angular/router';
import { CalendarComponent } from '../components/calendar/calendar.component';
import { LoginComponent } from '../components/login/login.component';

export const routes: Routes = [
    { path: "calendar", component: CalendarComponent },
    { path: "login", component: LoginComponent },
    { path: "**", redirectTo: "/calendar" }
];
