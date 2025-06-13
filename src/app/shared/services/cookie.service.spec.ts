import { TestBed } from '@angular/core/testing';
import { CookieService } from './cookie.service';
import { MockBuilder } from 'ng-mocks';
import { describe, beforeEach, it, expect, vi, afterEach } from 'vitest';
import { JwtHelperService } from '@auth0/angular-jwt';

describe('CookieService', () => {
    let service: CookieService;
    let jwtHelper: JwtHelperService;

    beforeEach(() => {
        return MockBuilder(CookieService).mock(JwtHelperService);
    });

    beforeEach(() => {
        service = TestBed.inject(CookieService);
        jwtHelper = TestBed.inject(JwtHelperService);

        // Mock Date.now() for consistent testing
        vi.spyOn(Date, 'now').mockImplementation(() => 1000000);
    });

    afterEach(() => {
        document.cookie =
            'cira-bearer-token=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/';
        vi.restoreAllMocks();
    });

    describe('loadTokenFromCookie', () => {
        it('should return null when cookie is not found', () => {
            const result: Maybe<string> = service.loadTokenFromCookie();
            expect(result).toBeNull();
        });

        it('should return decoded token when cookie exists', () => {
            document.cookie = 'cira-bearer-token=test-token; path=/';
            const result: Maybe<string> = service.loadTokenFromCookie();
            expect(result).toBe('test-token');
        });

        it('should handle URI encoded tokens', () => {
            const encodedToken: string = encodeURIComponent(
                'test.token+with/special=chars',
            );
            document.cookie = `cira-bearer-token=${encodedToken}; path=/`;
            const result = service.loadTokenFromCookie();
            expect(result).toBe('test.token+with/special=chars');
        });
    });

    describe('saveTokenToCookie', () => {
        it('should save token to cookie with correct parameters', () => {
            const token: string = 'test-token';
            const decodedToken: { [key: string]: number } = {
                id: 1,
                expiry_date: 2000,
            };
            vi.spyOn(jwtHelper, 'decodeToken').mockReturnValue(decodedToken);
            const cookieSetter = vi.spyOn(document, 'cookie', 'set');

            service.saveTokenToCookie(token);

            expect(cookieSetter).toHaveBeenCalledWith(
                expect.stringContaining('cira-bearer-token=test-token') &&
                    expect.stringContaining('path=/') &&
                    expect.stringContaining('max-age=1000') &&
                    expect.stringContaining('SameSite=Lax'),
            );
        });

        it('should delete the cookie if token is falsy', () => {
            const token: null = null;

            service.saveTokenToCookie(token);

            expect(document.cookie).toBe('');
        });

        it('should throw error when token cannot be decoded', () => {
            vi.spyOn(jwtHelper, 'decodeToken').mockReturnValue(null);

            expect(() => service.saveTokenToCookie('invalid-token')).toThrow(
                "Could not decode token, this shouldn't happen",
            );
        });
    });
});
