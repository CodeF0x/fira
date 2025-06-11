import { Routes } from '@angular/router';
import { hasValidSessionGuard } from './shared/guards/has-valid-session.guard';
import { hasInvalidOrNoSessionGuard } from './shared/guards/has-invalid-or-no-session.guard';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./tickets/ticket-list/ticket-list.component').then(
                (c) => c.TicketListComponent,
            ),
        canActivate: [hasValidSessionGuard],
    },
    {
        path: 'login',
        loadComponent: () =>
            import('./auth/login/login.component').then(
                (c) => c.LoginComponent,
            ),
        canActivate: [hasInvalidOrNoSessionGuard],
    },
    {
        path: 'signup',
        loadComponent: () =>
            import('./auth/signup/signup.component').then(
                (c) => c.SignupComponent,
            ),
        canActivate: [hasInvalidOrNoSessionGuard],
    },
];
