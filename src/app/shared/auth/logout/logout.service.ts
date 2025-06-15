import { inject, Injectable } from '@angular/core';
import { Config } from '../../../core/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Session } from '../../../core/session';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class LogoutService {
    private readonly _config: Config = inject(Config);
    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _session: Session = inject(Session);

    logout(): Observable<string> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this._session.userToken()}`,
        });
        return this._http.post(this._config.baseUrl + '/logout', null, {
            headers,
            responseType: 'text',
        });
    }
}
