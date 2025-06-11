import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SignupComponent } from './signup.component';
import { MockBuilder } from 'ng-mocks';
import { SignUpService } from './login.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { SignupFormFieldNames } from './signup.form';

describe('SignupComponent', () => {
    let fixture: ComponentFixture<SignupComponent>;
    let component: SignupComponent;
    let signUpService: SignUpService;
    let router: Router;

    beforeEach(() => {
        return MockBuilder(SignupComponent)
            .mock(SignUpService, {
                signUp: vi.fn().mockReturnValue(of(void 0)),
            })
            .mock(Router, {
                navigate: vi.fn().mockResolvedValue(true),
            });
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(SignupComponent);
        component = fixture.componentInstance;
        signUpService = TestBed.inject(SignUpService);
        router = TestBed.inject(Router);
    });

    describe('onSignup', () => {
        it('should redirect to /login on successful request', () => {
            component.form.setValue({
                [SignupFormFieldNames.USERNAME]: 'testuser',
                [SignupFormFieldNames.PASSWORD]: 'testpass',
                [SignupFormFieldNames.EMAIL]: 'test@example.com',
            });

            component.onSignup();

            expect(signUpService.signUp).toHaveBeenCalledWith({
                display_name: 'testuser',
                password: 'testpass',
                email: 'test@example.com',
            });

            expect(router.navigate).toHaveBeenCalledWith(['/login']);
        });
    });
});
