import { CanActivateFn, Router } from '@angular/router';
import { Session } from '../../core/session';
import { inject } from '@angular/core';

export const hasInvalidOrNoSessionGuard: CanActivateFn = () => {
    const session: Session = inject(Session);
    const router: Router = inject(Router);

    if (session.isSessionValid()) {
        router.navigate(['']);
        return false;
    }
    return true;
};
