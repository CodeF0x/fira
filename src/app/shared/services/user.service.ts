import { inject, Injectable, Signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Config } from '../../core/config';
import { Session } from '../../core/session';
import { Users } from '../models/user.model';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';

interface SingleUser {
    id: number;
    display_name: string;
    email: string;
}

type UsersResponse = ReadonlyArray<SingleUser>;

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _config: Config = inject(Config);
    private readonly _session: Session = inject(Session);

    readonly allUsers: Signal<Maybe<Users>> = toSignal(
        this._http
            .get<UsersResponse>(`${this._config.baseUrl}/users`, {
                headers: {
                    Authorization: `Bearer ${this._session.userToken()}`,
                },
            })
            .pipe(
                map((users) =>
                    users.map((user) => ({
                        id: user.id,
                        email: user.email,
                        displayName: user.display_name,
                    })),
                ),
            ),
    );

    // getAllUsers(): Observable<Users> {
    //     return this._http
    //         .get<UsersResponse>(`${this._config.baseUrl}/users`, {
    //             headers: {
    //                 Authorization: `Bearer ${this._session.userToken()}`,
    //             },
    //         })
    //         .pipe(
    //             map((users) =>
    //                 users.map((user) => ({
    //                     id: user.id,
    //                     email: user.email,
    //                     displayName: user.display_name,
    //                 })),
    //             ),
    //         );
    // }
}
