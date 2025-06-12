import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from '../shared/services/cookie.service';

@Injectable({ providedIn: 'root' })
export class Session {
    userToken: Maybe<string>;

    private readonly _jwtHelperService: JwtHelperService =
        inject(JwtHelperService);
    private readonly _cookieService: CookieService = inject(CookieService);

    constructor() {
        this.userToken = this._cookieService.loadTokenFromCookie();
    }

    isSessionValid(): boolean {
        if (!this.userToken) {
            return false;
        }
        return this._jwtHelperService.isTokenExpired(this.userToken);
    }
}
