import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { MockBuilder } from 'ng-mocks';
import { SignUpResponse, SignUpService } from './signup.service';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { of, throwError } from 'rxjs';
import { SignupFormFieldNames } from './signup.form';
import { ToastCloseEvent } from 'primeng/toast';

describe('SignupComponent', () => {
    let fixture: ComponentFixture<SignupComponent>;
    let component: SignupComponent;
    let signUpService: SignUpService;
    let router: Router;
    let messageService: MessageService;

    beforeEach(() => {
        return MockBuilder(SignupComponent)
            .mock(SignUpService, {
                signUp: vi.fn().mockReturnValue(of({} as SignUpResponse)),
            })
            .mock(Router, {
                navigate: vi.fn().mockResolvedValue(true),
            })
            .mock(MessageService, {
                add: vi.fn(),
            })
            .mock(TranslateService, {
                instant: vi.fn().mockImplementation((key) => key),
            });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        signUpService = TestBed.inject(SignUpService);
        router = TestBed.inject(Router);
        messageService = TestBed.inject(MessageService);
    });

    describe('onSignup', () => {
        beforeEach(() => {
            component.form.setValue({
                [SignupFormFieldNames.USERNAME]: 'testuser',
                [SignupFormFieldNames.PASSWORD]: 'testpass',
                [SignupFormFieldNames.EMAIL]: 'test@example.com',
            });
        });

        it('should show success message on successful signup', () => {
            component.onSignup();

            expect(signUpService.signUp).toHaveBeenCalledWith(
                'testuser',
                'test@example.com',
                'testpass',
            );

            expect(messageService.add).toHaveBeenCalledWith({
                id: 'success-message',
                severity: 'success',
                summary: 'PAGE_CONTENT.SIGNUP_PAGE.MESSAGES.TITLES.SUCCESS',
                detail: 'PAGE_CONTENT.SIGNUP_PAGE.MESSAGES.BODIES.SUCCESS',
                life: 3000,
            });
        });

        it('should show error message on failed signup', () => {
            vi.spyOn(signUpService, 'signUp').mockReturnValueOnce(
                throwError(() => new Error('test error')),
            );

            component.onSignup();

            expect(messageService.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'PAGE_CONTENT.SIGNUP_PAGE.MESSAGES.TITLES.ERROR',
                detail: 'PAGE_CONTENT.SIGNUP_PAGE.MESSAGES.BODIES.ERROR',
                sticky: true,
            });
        });
    });

    describe('onMessageClose', () => {
        it('should navigate to login page when success message is closed', () => {
            const event: ToastCloseEvent = {
                message: { id: 'success-message' },
            } as ToastCloseEvent;

            component.onMessageClose(event);

            expect(router.navigate).toHaveBeenCalledWith(['/login']);
        });

        it('should not navigate when non-success message is closed', () => {
            const event: ToastCloseEvent = {
                message: { id: 'other-message' },
            } as ToastCloseEvent;

            component.onMessageClose(event);

            expect(router.navigate).not.toHaveBeenCalled();
        });
    });
});
