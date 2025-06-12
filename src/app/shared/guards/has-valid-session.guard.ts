import {CanActivateFn, Router} from '@angular/router';
import {inject} from '@angular/core';
import {Session} from '../../core/session';

export const hasValidSessionGuard: CanActivateFn = () => {
    const session = inject(Session);
    const router: Router = inject(Router);

    if (session.isSessionValid()) {
        return true;
    }
    router.navigate(['/login']);
    return false;
};
