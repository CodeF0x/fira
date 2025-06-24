import { TicketsService } from './tickets.service';
import { HttpClient } from '@angular/common/http';
import { MockBuilder } from 'ng-mocks';
import { Config } from '../../core/config';
import { Session } from '../../core/session';
import { beforeEach, describe, Mock } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
    CreateTicket,
    TicketLabel,
    TicketResponse,
    TicketStatus,
} from '../models/ticket.model';
import { of } from 'rxjs';

const newTicket: CreateTicket = {
    body: 'Body',
    title: 'Title',
    assigned_user: null,
    labels: [TicketLabel.FEATURE],
    status: TicketStatus.OPEN,
};

const returnedTicket: TicketResponse = {
    ...newTicket,
    id: 1,
    created: '1750448806132',
    last_modified: '1750448806132',
    assigned_user: newTicket.assigned_user,
};

describe('TicketsService', () => {
    let service: TicketsService;
    let httpClient: HttpClient;

    beforeEach(() =>
        MockBuilder(TicketsService)
            .mock(HttpClient, {
                post: vi.fn().mockReturnValue(of(returnedTicket)),
            })
            .mock(Config, {
                baseUrl: 'http://test-api',
            })
            .mock(Session, {
                userToken: signal('fake-token'),
            }),
    );

    beforeEach(() => {
        service = TestBed.inject(TicketsService);
        httpClient = TestBed.inject(HttpClient);
    });

    describe('createTicket', () => {
        it('should call api with ticket model and return formated ticket', () => {
            const spy: Mock = vi.fn();
            service.createTicket(newTicket).subscribe(spy);

            const [url, body, options] = (httpClient.post as any).mock.calls[0];

            expect(url).toBe('http://test-api/tickets');
            expect(body).toEqual(newTicket);
            expect(options.headers.get('Authorization')).toBe(
                'Bearer fake-token',
            );

            expect(spy).toHaveBeenCalledWith(
                expect.objectContaining({
                    ...newTicket,
                    id: returnedTicket.id,
                    assignedUser: returnedTicket.assigned_user,
                    lastModified: returnedTicket.last_modified,
                    created: returnedTicket.created,
                }),
            );
        });
    });
});
