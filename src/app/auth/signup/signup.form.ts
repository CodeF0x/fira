import { FormControl } from '@angular/forms';

export enum SignupFormFieldNames {
    PASSWORD = 'password',
    USERNAME = 'username',
    EMAIL = 'email',
}

export interface SignupForm {
    [SignupFormFieldNames.PASSWORD]: FormControl<string>;
    [SignupFormFieldNames.USERNAME]: FormControl<string>;
    [SignupFormFieldNames.EMAIL]: FormControl<string>;
}
