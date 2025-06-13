import { Component, inject } from '@angular/core';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { LoginForm, LoginFormFields } from './login.form';
import { Button } from 'primeng/button';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';
import { Tooltip } from 'primeng/tooltip';
import { FloatLabel } from 'primeng/floatlabel';
import { ExtractFirstErrorPipe } from '../../shared/extract-first-error.pipe';
import { LoginService } from './login.service';
import { Router, RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';
import { catchError, EMPTY } from 'rxjs';
import { Session } from '../../core/session';

@Component({
    selector: 'app-login',
    imports: [
        ReactiveFormsModule,
        Button,
        TranslatePipe,
        InputText,
        Password,
        Tooltip,
        FloatLabel,
        ExtractFirstErrorPipe,
        RouterLink,
        Toast,
    ],
    providers: [LoginService, MessageService],
    templateUrl: './login.component.html',
    styleUrl: './login.component.scss',
})
export class LoginComponent {
    protected readonly LoginFormFields: typeof LoginFormFields =
        LoginFormFields;

    readonly form: FormGroup<LoginForm> = new FormGroup({
        [LoginFormFields.EMAIL]: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required, Validators.email],
        }),
        [LoginFormFields.PASSWORD]: new FormControl<string>('', {
            nonNullable: true,
            validators: [Validators.required],
        }),
    });

    private readonly _loginService: LoginService = inject(LoginService);
    private readonly _messageService: MessageService = inject(MessageService);
    private readonly _translateService: TranslateService =
        inject(TranslateService);
    private readonly _session: Session = inject(Session);
    private readonly _router: Router = inject(Router);

    onLogin(): void {
        if (!this.form.valid) {
            return;
        }

        const password: string = this.form.value[LoginFormFields.PASSWORD]!;
        const email: string = this.form.value[LoginFormFields.EMAIL]!;

        this._loginService
            .signIn(password, email)
            .pipe(
                catchError((error) => {
                    if (error.status === 401) {
                        this._messageService.add({
                            severity: 'error',
                            summary: this._translateService.instant(
                                'PAGE_CONTENT.LOGIN_PAGE.MESSAGES.TITLES.ERROR',
                            ),
                            detail: this._translateService.instant(
                                'PAGE_CONTENT.LOGIN_PAGE.MESSAGES.BODIES.WRONG_CREDENTIALS',
                            ),
                            sticky: false,
                            life: 3000,
                        });
                    } else {
                        this._messageService.add({
                            severity: 'error',
                            summary: this._translateService.instant(
                                'PAGE_CONTENT.LOGIN_PAGE.MESSAGES.TITLES.ERROR',
                            ),
                            detail: this._translateService.instant(
                                'PAGE_CONTENT.LOGIN_PAGE.MESSAGES.BODIES.ERROR',
                            ),
                            sticky: false,
                            life: 3000,
                        });
                    }

                    return EMPTY;
                }),
            )
            .subscribe((token) => {
                this._session.setNewToken(token);
                this._router.navigate(['']);
            });
    }
}
