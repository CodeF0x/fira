import {
    computed,
    inject,
    Injectable,
    Signal,
    signal,
    WritableSignal,
} from '@angular/core';
import { JwtHelperService } from '@auth0/angular-jwt';
import { CookieService } from '../shared/services/cookie.service';

@Injectable({ providedIn: 'root' })
export class Session {
    readonly isSessionValid: Signal<boolean> = computed(() => {
        if (!this._userToken()) {
            return false;
        }
        return !this._jwtHelperService.isTokenExpired(this._userToken()!);
    });
    readonly userToken: Signal<Maybe<string>> = computed(() =>
        this._userToken(),
    );

    private readonly _jwtHelperService: JwtHelperService =
        inject(JwtHelperService);
    private readonly _cookieService: CookieService = inject(CookieService);

    private readonly _userToken: WritableSignal<Maybe<string>> = signal(null);

    constructor() {
        this._userToken.set(this._cookieService.loadTokenFromCookie());
    }

    setNewToken(token: Maybe<string>): void {
        this._userToken.set(token);
        this._cookieService.saveTokenToCookie(token);
    }
}
