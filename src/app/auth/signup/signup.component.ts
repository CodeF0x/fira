import { Component, inject } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { SignupForm, SignupFormFieldNames } from './signup.form';
import { FloatLabel } from 'primeng/floatlabel';
import { Tooltip } from 'primeng/tooltip';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { ExtractFirstErrorPipe } from '../../shared/extract-first-error.pipe';
import { SignUpService } from './signup.service';
import { Router, RouterLink } from '@angular/router';
import { Toast, ToastCloseEvent } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { catchError, EMPTY } from 'rxjs';

@Component({
    selector: 'app-signup',
    imports: [
        Button,
        InputText,
        Password,
        ReactiveFormsModule,
        FloatLabel,
        Tooltip,
        TranslatePipe,
        ExtractFirstErrorPipe,
        Toast,
        RouterLink,
    ],
    providers: [SignUpService, MessageService],
    templateUrl: './signup.component.html',
    styleUrl: './signup.component.scss',
})
export class SignupComponent {
    protected readonly SignupFormFieldNames: typeof SignupFormFieldNames =
        SignupFormFieldNames;

    readonly form: FormGroup<SignupForm> = new FormGroup({
        [SignupFormFieldNames.USERNAME]: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.minLength(3)],
        }),
        [SignupFormFieldNames.PASSWORD]: new FormControl('', {
            nonNullable: true,
            validators: [
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(128),
            ],
        }),
        [SignupFormFieldNames.EMAIL]: new FormControl('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
    });

    private readonly _signUpService: SignUpService = inject(SignUpService);
    private readonly _router: Router = inject(Router);
    private readonly _messageService: MessageService = inject(MessageService);
    private readonly _translateService: TranslateService =
        inject(TranslateService);

    onSignup(): void {
        if (!this.form.valid) {
            return;
        }

        const display_name: string =
            this.form.value[SignupFormFieldNames.USERNAME]!;
        const email: string = this.form.value[SignupFormFieldNames.EMAIL]!;
        const password: string =
            this.form.value[SignupFormFieldNames.PASSWORD]!;

        this._signUpService
            .signUp(display_name, email, password)
            .pipe(
                catchError((_error) => {
                    this._messageService.add({
                        severity: 'error',
                        summary: this._translateService.instant(
                            'PAGE_CONTENT.SIGNUP_PAGE.MESSAGES.TITLES.ERROR',
                        ),
                        detail: this._translateService.instant(
                            'PAGE_CONTENT.SIGNUP_PAGE.MESSAGES.BODIES.ERROR',
                        ),
                        sticky: true,
                    });
                    return EMPTY;
                }),
            )
            .subscribe(() =>
                this._messageService.add({
                    id: 'success-message',
                    severity: 'success',
                    summary: this._translateService.instant(
                        'PAGE_CONTENT.SIGNUP_PAGE.MESSAGES.TITLES.SUCCESS',
                    ),
                    detail: this._translateService.instant(
                        'PAGE_CONTENT.SIGNUP_PAGE.MESSAGES.BODIES.SUCCESS',
                    ),
                    life: 3000,
                }),
            );
    }

    onMessageClose(event: ToastCloseEvent): void {
        if (event.message.id === 'success-message') {
            this._router.navigate(['/login']);
        }
    }
}
