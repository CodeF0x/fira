import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../core/config';

@Injectable()
export class LoginService {
    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _config: Config = inject(Config);

    signIn(password: string, email: string): Observable<string> {
        return this._http.post(
            this._config.baseUrl + '/login',
            {
                password,
                email,
            },
            {
                responseType: 'text',
            },
        );
    }
}
