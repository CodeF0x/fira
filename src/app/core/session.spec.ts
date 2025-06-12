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
            const mockToken: string = 'test-token';

            cookieService = TestBed.inject(CookieService);
            vi.spyOn(cookieService, 'loadTokenFromCookie').mockReturnValue(
                mockToken,
            );

            service = TestBed.inject(Session);

            expect(cookieService.loadTokenFromCookie).toHaveBeenCalled();
            expect(service.userToken).toBe(mockToken);
        });

        it('should handle null token from cookie', () => {
            const mockToken: null = null;

            cookieService = TestBed.inject(CookieService);
            vi.spyOn(cookieService, 'loadTokenFromCookie').mockReturnValue(
                mockToken,
            );

            service = TestBed.inject(Session);

            expect(cookieService.loadTokenFromCookie).toHaveBeenCalled();
            expect(service.userToken).toBeNull();
        });
    });

    describe('isSessionValid', () => {
        beforeEach(() => {
            service = TestBed.inject(Session);
            jwtHelperService = TestBed.inject(JwtHelperService);
        });

        it('should return false when no token exists', () => {
            service.userToken = null;

            const result = service.isSessionValid();

            expect(result).toBe(false);
            expect(jwtHelperService.isTokenExpired).not.toHaveBeenCalled();
        });

        it('should check token expiration when token exists', () => {
            service.userToken = 'test-token';
            // @ts-expect-error vitest does not understand that a boolean is returned instead of a Promise
            vi.spyOn(jwtHelperService, 'isTokenExpired').mockReturnValue(true);

            const result = service.isSessionValid();

            expect(jwtHelperService.isTokenExpired).toHaveBeenCalledWith(
                'test-token',
            );
            expect(result).toBe(true);
        });

        it('should return jwt helper service result when token exists', () => {
            service.userToken = 'test-token';
            // @ts-expect-error vitest does not understand that a boolean is returned instead of a Promise
            vi.spyOn(jwtHelperService, 'isTokenExpired').mockReturnValue(false);

            const result = service.isSessionValid();

            expect(result).toBe(false);
        });
    });
});
