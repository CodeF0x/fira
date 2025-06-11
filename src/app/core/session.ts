import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class Session {
    userToken: Maybe<string>;

    private readonly _jwtHelperService: JwtHelperService =
        inject(JwtHelperService);

    constructor() {
        this.userToken = this._loadTokenFromCookie();
    }

    isSessionValid(): boolean {
        if (!this.userToken) {
            return false;
        }
        return this._jwtHelperService.isTokenExpired(this.userToken);
    }

    private _loadTokenFromCookie(): Maybe<string> {
        const match: Maybe<RegExpMatchArray> = document.cookie.match(
            /(^| )cira-bearer-token=([^;]+)/,
        );
        return match ? decodeURIComponent(match[2]) : null;
    }
}
