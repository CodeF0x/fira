import { inject, Injectable } from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable({ providedIn: 'root' })
export class CookieService {
    private readonly _jwtHelper: JwtHelperService = inject(JwtHelperService);

    loadTokenFromCookie(): Maybe<string> {
        const match: Maybe<RegExpMatchArray> = document.cookie.match(
            /(^| )cira-bearer-token=([^;]+)/,
        );
        return match ? decodeURIComponent(match[2]) : null;
    }

    saveTokenToCookie(token: Maybe<string>): void {
        if (!token) {
            document.cookie = `cira-bearer-token=${token}; path=/; max-age=0; SameSite=Lax`;
            return;
        }

        const decodedToken: Maybe<{ id: number; exp: number }> =
            this._jwtHelper.decodeToken(token);

        if (!decodedToken) {
            throw new Error("Could not decode token, this shouldn't happen");
        }

        const exp: number = decodedToken.exp;

        const now: number = Math.floor(Date.now() / 1000);
        const maxAge: number = exp - now;

        document.cookie = `cira-bearer-token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    }
}
