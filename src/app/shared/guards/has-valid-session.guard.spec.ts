import { TestBed } from '@angular/core/testing';
import { MockBuilder, MockService } from 'ng-mocks';
import { hasValidSessionGuard } from './has-valid-session.guard';
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

describe('hasValidSessionGuard', () => {
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

    it('should allow activation when session is valid', () => {
        vi.spyOn(session, 'isSessionValid').mockReturnValue(true);
        vi.spyOn(router, 'navigate');

        const result: MaybeAsync<GuardResult> = TestBed.runInInjectionContext(
            () =>
                hasValidSessionGuard(
                    {} as ActivatedRouteSnapshot,
                    {} as RouterStateSnapshot,
                ),
        );

        expect(result).toBe(true);
        expect(router.navigate).not.toHaveBeenCalled();
    });

    it('should prevent activation and redirect to login when session is invalid', () => {
        vi.spyOn(session, 'isSessionValid').mockReturnValue(false);

        const result: MaybeAsync<GuardResult> = TestBed.runInInjectionContext(
            () =>
                hasValidSessionGuard(
                    {} as ActivatedRouteSnapshot,
                    {} as RouterStateSnapshot,
                ),
        );

        expect(result).toBe(false);
        expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should redirect to login only when session is invalid', () => {
        vi.spyOn(session, 'isSessionValid').mockReturnValue(true);

        const result: MaybeAsync<GuardResult> = TestBed.runInInjectionContext(
            () =>
                hasValidSessionGuard(
                    {} as ActivatedRouteSnapshot,
                    {} as RouterStateSnapshot,
                ),
        );

        expect(router.navigate).not.toHaveBeenCalled();
        expect(result).toBe(true);
    });

    it('should check session validity exactly once per guard call', () => {
        vi.spyOn(session, 'isSessionValid').mockReturnValue(false);

        TestBed.runInInjectionContext(() =>
            hasValidSessionGuard(
                {} as ActivatedRouteSnapshot,
                {} as RouterStateSnapshot,
            ),
        );

        expect(session.isSessionValid).toHaveBeenCalledTimes(1);
    });
});
