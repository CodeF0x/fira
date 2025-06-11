import { inject, Pipe, PipeTransform } from '@angular/core';
import { ValidationErrors } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

export interface ExtractFirstErrorOptions {
    maxAmount?: number;
    minAmount?: number;
}

@Pipe({
    name: 'extractFirstError',
})
export class ExtractFirstErrorPipe implements PipeTransform {
    private readonly _translateService: TranslateService =
        inject(TranslateService);

    transform(
        errors: ValidationErrors | null,
        options: ExtractFirstErrorOptions,
    ): string {
        if (!errors) {
            return '';
        }

        return this._translateService.instant(
            `FORM.VALIDATION.${Object.keys(errors)[0].toUpperCase()}`,
            options,
        );
    }
}
