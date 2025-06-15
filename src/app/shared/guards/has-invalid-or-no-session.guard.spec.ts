import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockService } from 'ng-mocks';
import { hasInvalidOrNoSessionGuard } from './has-invalid-or-no-session.guard';
import {
    ActivatedRouteSnapshot,
    GuardResult,
    MaybeAsync,
    Router,
    RouterStateSnapshot,
} from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { signal } from '@angular/core';
import { Session } from '../../core/session';

describe('hasInvalidOrNoSessionGuard', () => {
    let router: Router;
    let session: Session;

    beforeEach(() => {
        return MockBuilder()
            .provide({
                provide: Router,
                useValue: MockService(Router, {
                    navigate: vi.fn(),
                }),
            })
            .provide({
                provide: Session,
                useValue: MockService(Session, {
                    isSessionValid: signal(false),
                }),
            });
    });

    beforeEach(() => {
        router = TestBed.inject(Router);
        session = TestBed.inject(Session);
    });

    it('should allow activation when session is invalid', () => {
        vi.spyOn(session, 'isSessionValid').mockReturnValue(false);

        const result: MaybeAsync<GuardResult> = TestBed.runInInjectionContext(
            () =>
                hasInvalidOrNoSessionGuard(
                    {} as ActivatedRouteSnapshot,
                    {} as RouterStateSnapshot,
                ),
        );

        expect(result).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should prevent activation and redirect to home when session is valid', () => {
        vi.spyOn(session, 'isSessionValid').mockReturnValue(true);

        const result: MaybeAsync<GuardResult> = TestBed.runInInjectionContext(
            () =>
                hasInvalidOrNoSessionGuard(
                    {} as ActivatedRouteSnapshot,
                    {} as RouterStateSnapshot,
                ),
        );

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['']);
    });

    it('should redirect to home only when session is valid', () => {
        vi.spyOn(session, 'isSessionValid').mockReturnValue(false);

        TestBed.runInInjectionContext(() =>
            hasInvalidOrNoSessionGuard(
                {} as ActivatedRouteSnapshot,
                {} as RouterStateSnapshot,
            ),
        );

        expect(router.navigate).not.toHaveBeenCalled();
    });
});
