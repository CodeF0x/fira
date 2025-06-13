import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { hasValidSessionGuard } from './has-valid-session.guard';

describe('hasValidSessionGuard', () => {
    const executeGuard: CanActivateFn = (...guardParameters) =>
        TestBed.runInInjectionContext(() =>
            hasValidSessionGuard(...guardParameters),
        );

    beforeEach(() => {
        TestBed.configureTestingModule({});
    });

    it('should be created', () => {
        expect(executeGuard).toBeTruthy();
    });
});
