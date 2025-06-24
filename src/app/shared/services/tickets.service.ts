import { inject, Injectable } from '@angular/core';
import { Config } from '../../core/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { CreateTicket, Ticket, TicketResponse } from '../models/ticket.model';
import { Session } from '../../core/session';

@Injectable({
    providedIn: 'root',
})
export class TicketsService {
    private readonly _config: Config = inject(Config);
    private readonly _http: HttpClient = inject(HttpClient);
    private readonly _session: Session = inject(Session);

    createTicket(ticket: CreateTicket): Observable<Ticket> {
        const headers = new HttpHeaders({
            Authorization: `Bearer ${this._session.userToken()}`,
        });
        return this._http
            .post<TicketResponse>(this._config.baseUrl + '/tickets', ticket, {
                headers,
            })
            .pipe(
                map((ticket) => {
                    return {
                        ...ticket,
                        lastModified: ticket.last_modified,
                        assignedUser: ticket.assigned_user,
                    };
                }),
            );
    }
}
