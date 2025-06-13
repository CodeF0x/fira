import { TestBed } from '@angular/core/testing';
import { Session } from './session';
import { MockBuilder } from 'ng-mocks';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from '../shared/services/cookie.service';
import { describe, it, expect, vi } from 'vitest';

describe('Session', () => {
    let service: Session;
    let jwtHelperService: JwtHelperService;
    let cookieService: CookieService;

    beforeEach(() =>
        MockBuilder(Session)
            .mock(CookieService, {
                loadTokenFromCookie: vi.fn(),
            })
            .mock(JwtHelperService, {
                isTokenExpired: vi.fn(),
            }),
    );

    describe('constructor', () => {
        it('should load token from cookie on initialization', () => {
            cookieService = TestBed.inject(CookieService);
            vi.spyOn(cookieService, 'loadTokenFromCookie');

            service = TestBed.inject(Session);

            expect(cookieService.loadTokenFromCookie).toHaveBeenCalled();
        });
    });

    describe('isSessionValid', () => {
        beforeEach(() => {
            service = TestBed.inject(Session);
            jwtHelperService = TestBed.inject(JwtHelperService);
        });

        it('should return false when no token exists', () => {
            service.setNewToken(null);

            const result = service.isSessionValid();

            expect(result).toBe(false);
            expect(jwtHelperService.isTokenExpired).not.toHaveBeenCalled();
        });

        it('should return true when token exists and is not expired', () => {
            service.setNewToken('test-token');
            // @ts-expect-error vitest does not understand that a boolean is returned instead of a Promise
            vi.spyOn(jwtHelperService, 'isTokenExpired').mockReturnValue(false);

            const result = service.isSessionValid();

            expect(jwtHelperService.isTokenExpired).toHaveBeenCalledWith(
                'test-token',
            );
            expect(result).toBe(true);
        });

        it('should return false if token exists and is expired', () => {
            service.setNewToken('test-token');
            // @ts-expect-error vitest does not understand that a boolean is returned instead of a Promise
            vi.spyOn(jwtHelperService, 'isTokenExpired').mockReturnValue(true);

            const result = service.isSessionValid();

            expect(result).toBe(false);
        });
    });
});
