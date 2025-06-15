import { FormControl } from '@angular/forms';

export const LoginFormFields = {
    EMAIL: 'email',
    PASSWORD: 'password',
} as const;

export interface LoginForm {
    [LoginFormFields.EMAIL]: FormControl<string>;
    [LoginFormFields.PASSWORD]: FormControl<string>;
}
