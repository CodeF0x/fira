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
import { TranslatePipe } from '@ngx-translate/core';
import { ExtractFirstErrorPipe } from '../../shared/extract-first-error.pipe';
import { SignUpPayload, SignUpService } from './login.service';
import { Router } from '@angular/router';

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
    ],
    providers: [SignUpService],
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

    onSignup(): void {
        const payload: SignUpPayload = {
            display_name: this.form.value[SignupFormFieldNames.USERNAME]!,
            password: this.form.value[SignupFormFieldNames.PASSWORD]!,
            email: this.form.value[SignupFormFieldNames.EMAIL]!,
        };

        this._signUpService.signUp(payload).subscribe({
            next: () => this._router.navigate(['/login']),
            error: () => alert('Oopsie whoopsie >w<'),
        });
    }
}
