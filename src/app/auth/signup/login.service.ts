import { inject, Injectable } from '@angular/core';
import { Observable, take } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../core/config';

export interface SignUpResponse {
    display_name: string;
    password: string;
    email: string;
}

export interface SignUpPayload {
    display_name: string;
    password: string;
    email: string;
}

@Injectable()
export class SignUpService {
    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _config: Config = inject(Config);

    signUp(payload: SignUpPayload): Observable<SignUpResponse> {
        return this._http
            .post<SignUpResponse>(this._config.baseUrl + '/signup', payload)
            .pipe(take(1));
    }
}
