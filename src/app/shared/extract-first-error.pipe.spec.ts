import { TestBed } from '@angular/core/testing';
import { ExtractFirstErrorPipe } from './extract-first-error.pipe';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';

// Create a fake loader that returns empty translations
class FakeTranslateLoader implements TranslateLoader {
    getTranslation(): Observable<any> {
        return of({});
    }
}

describe('ExtractFirstErrorPipe', () => {
    let pipe: ExtractFirstErrorPipe;

    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({
                    loader: {
                        provide: TranslateLoader,
                        useClass: FakeTranslateLoader,
                    },
                }),
            ],
            providers: [ExtractFirstErrorPipe],
        });

        pipe = TestBed.inject(ExtractFirstErrorPipe);
    });

    it('create an instance', () => {
        expect(pipe).toBeTruthy();
    });
});
