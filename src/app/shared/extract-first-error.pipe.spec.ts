import { TestBed } from '@angular/core/testing';
import {
    ExtractFirstErrorPipe,
    ExtractFirstErrorOptions,
} from './extract-first-error.pipe';
import { TranslateService } from '@ngx-translate/core';
import { ValidationErrors } from '@angular/forms';
import { describe, beforeEach, it, expect, vi } from 'vitest';

describe('ExtractFirstErrorPipe', () => {
    let pipe: ExtractFirstErrorPipe;
    let translateService: TranslateService;

    // Could not get it to work with ng-mocks MockBuilder:
    // Error [NullInjectorError]: R3InjectorError[ExtractFirstErrorPipe2 -> ExtractFirstErrorPipe2]:
    // NullInjectorError: No provider for ExtractFirstErrorPipe2!
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ExtractFirstErrorPipe,
                {
                    provide: TranslateService,
                    useValue: {
                        instant: vi.fn().mockImplementation((key) => key),
                    },
                },
            ],
        });
        pipe = TestBed.inject(ExtractFirstErrorPipe);
        translateService = TestBed.inject(TranslateService);
    });

    it('should return empty string for null errors', () => {
        const result = pipe.transform(null);
        expect(result).toBe('');
    });

    it('should transform single error without options', () => {
        const errors: ValidationErrors = {
            required: true,
        };

        pipe.transform(errors);

        expect(translateService.instant).toHaveBeenCalledWith(
            'FORM.VALIDATION.REQUIRED',
            {},
        );
    });

    it('should pass through options when provided', () => {
        const errors: ValidationErrors = {
            min: true,
        };
        const options: ExtractFirstErrorOptions = {
            minAmount: 5,
        };

        pipe.transform(errors, options);

        expect(translateService.instant).toHaveBeenCalledWith(
            'FORM.VALIDATION.MIN',
            options,
        );
    });

    it('should take first error when multiple errors present', () => {
        const errors: ValidationErrors = {
            required: true,
            minlength: true,
            email: true,
        };

        pipe.transform(errors);

        expect(translateService.instant).toHaveBeenCalledWith(
            'FORM.VALIDATION.REQUIRED',
            {},
        );
    });

    it('should uppercase error key in translation path', () => {
        const errors: ValidationErrors = {
            customError: true,
        };

        pipe.transform(errors);

        expect(translateService.instant).toHaveBeenCalledWith(
            'FORM.VALIDATION.CUSTOMERROR',
            {},
        );
    });

    it('should handle null options by using empty object', () => {
        const errors: ValidationErrors = {
            required: true,
        };

        pipe.transform(errors, null);

        expect(translateService.instant).toHaveBeenCalledWith(
            'FORM.VALIDATION.REQUIRED',
            {},
        );
    });

    it('should handle undefined options by using empty object', () => {
        const errors: ValidationErrors = {
            required: true,
        };

        pipe.transform(errors, undefined);

        expect(translateService.instant).toHaveBeenCalledWith(
            'FORM.VALIDATION.REQUIRED',
            {},
        );
    });
});
