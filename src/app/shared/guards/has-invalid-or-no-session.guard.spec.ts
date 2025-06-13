import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { hasInvalidOrNoSessionGuard } from './has-invalid-or-no-session.guard';

describe('hasInvalidOrNoSessionGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() =>
            hasInvalidOrNoSessionGuard(...guardParameters),
        );

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});
