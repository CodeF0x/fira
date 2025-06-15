import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../core/config';

export interface SignUpResponse {
    display_name: string;
    password: string;
    email: string;
}

@Injectable()
export class SignUpService {
    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _config: Config = inject(Config);

    signUp(
        display_name: string,
        email: string,
        password: string,
    ): Observable<SignUpResponse> {
        return this._http.post<SignUpResponse>(
            this._config.baseUrl + '/signup',
            {
                display_name,
                email,
                password,
            },
        );
    }
}
