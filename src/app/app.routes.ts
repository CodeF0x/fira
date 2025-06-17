import { Routes } from '@angular/router';
import { hasValidSessionGuard } from './shared/guards/has-valid-session.guard';
import { hasInvalidOrNoSessionGuard } from './shared/guards/has-invalid-or-no-session.guard';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';

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
        path: 'new',
        loadComponent: () =>
            import('./tickets/create-ticket/create-ticket.component').then(
                (c) => c.CreateTicketComponent,
            ),
        canActivate: [hasValidSessionGuard],
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [hasInvalidOrNoSessionGuard],
    },
    {
        path: 'signup',
        component: SignupComponent,
        canActivate: [hasInvalidOrNoSessionGuard],
    },
];
