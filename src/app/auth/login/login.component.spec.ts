import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { MockBuilder } from 'ng-mocks';
import { LoginService } from './login.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from '../../shared/services/cookie.service';
import { of, throwError } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginFormFields } from './login.form';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('LoginComponent', () => {
    let fixture: ComponentFixture<LoginComponent>;
    let component: LoginComponent;
    let loginService: LoginService;
    let messageService: MessageService;
    let cookieService: CookieService;
    let router: Router;

    beforeEach(() => {
        return MockBuilder(LoginComponent)
            .mock(LoginService, {
                signIn: vi.fn().mockReturnValue(of('token')),
            })
            .mock(MessageService, {
                add: vi.fn(),
            })
            .mock(TranslateService, {
                instant: vi.fn().mockImplementation((key) => key),
            })
            .mock(CookieService, {
                saveTokenToCookie: vi.fn(),
            })
            .mock(Router, {
                navigate: vi.fn().mockResolvedValue(true),
            });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        loginService = TestBed.inject(LoginService);
        messageService = TestBed.inject(MessageService);
        cookieService = TestBed.inject(CookieService);
        router = TestBed.inject(Router);
    });

    describe('onLogin', () => {
        const validEmail = 'test@email.com';
        const validPassword = 'password123';

        beforeEach(() => {
            component.form.setValue({
                [LoginFormFields.EMAIL]: validEmail,
                [LoginFormFields.PASSWORD]: validPassword,
            });
        });

        it('should not call signIn if form is invalid', () => {
            component.form.controls[LoginFormFields.EMAIL].setErrors({
                email: true,
            });
            component.onLogin();
            expect(loginService.signIn).not.toHaveBeenCalled();
        });

        it('should call signIn with correct credentials when form is valid', () => {
            component.onLogin();
            expect(loginService.signIn).toHaveBeenCalledWith(
                validPassword,
                validEmail,
            );
        });

        it('should save token and navigate on successful login', () => {
            const token = 'test-token';
            vi.spyOn(loginService, 'signIn').mockReturnValueOnce(of(token));

            component.onLogin();

            expect(cookieService.saveTokenToCookie).toHaveBeenCalledWith(token);
            expect(router.navigate).toHaveBeenCalledWith(['']);
        });

        it('should show unauthorized error message on 401 error', () => {
            vi.spyOn(loginService, 'signIn').mockReturnValueOnce(
                throwError(() => new HttpErrorResponse({ status: 401 })),
            );

            component.onLogin();

            expect(messageService.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'PAGE_CONTENT.LOGIN_PAGE.MESSAGES.TITLES.ERROR',
                detail: 'PAGE_CONTENT.LOGIN_PAGE.MESSAGES.BODIES.WRONG_CREDENTIALS',
                sticky: false,
                life: 3000,
            });
            expect(cookieService.saveTokenToCookie).not.toHaveBeenCalled();
            expect(router.navigate).not.toHaveBeenCalled();
        });

        it('should show generic error message on non-401 errors', () => {
            vi.spyOn(loginService, 'signIn').mockReturnValueOnce(
                throwError(() => new HttpErrorResponse({ status: 500 })),
            );

            component.onLogin();

            expect(messageService.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'PAGE_CONTENT.LOGIN_PAGE.MESSAGES.TITLES.ERROR',
                detail: 'PAGE_CONTENT.LOGIN_PAGE.MESSAGES.BODIES.ERROR',
                sticky: false,
                life: 3000,
            });
            expect(cookieService.saveTokenToCookie).not.toHaveBeenCalled();
            expect(router.navigate).not.toHaveBeenCalled();
        });

        it('should not save token or navigate on error', () => {
            vi.spyOn(loginService, 'signIn').mockReturnValueOnce(
                throwError(() => new HttpErrorResponse({ status: 500 })),
            );

            component.onLogin();

            expect(cookieService.saveTokenToCookie).not.toHaveBeenCalled();
            expect(router.navigate).not.toHaveBeenCalled();
        });
    });
});
