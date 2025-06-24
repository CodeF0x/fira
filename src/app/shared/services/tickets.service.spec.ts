import { TicketsService } from './tickets.service';
import { HttpClient } from '@angular/common/http';
import { MockBuilder } from 'ng-mocks';
import { Config } from '../../core/config';
import { Session } from '../../core/session';
import { beforeEach, describe } from 'vitest';
import { signal } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import {
    CreateTicket,
    TicketLabel,
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

describe('TicketsService', () => {
    let service: TicketsService;
    let httpClient: HttpClient;

    beforeEach(() =>
        MockBuilder(TicketsService)
            .mock(HttpClient, {
                post: vi.fn().mockReturnValue(
                    of({
                        ...newTicket,
                        id: 1,
                        created: '1750448806132',
                        lastModified: '1750448806132',
                        assignedUser: newTicket.assigned_user,
                    }),
                ),
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
        it('should call api with ticket model', () => {
            vi.spyOn(httpClient, 'post');

            service.createTicket(newTicket).subscribe();

            const [url, body, options] = (httpClient.post as any).mock.calls[0];

            expect(url).toBe('http://test-api/tickets');
            expect(body).toEqual(newTicket);
            expect(options.headers.get('Authorization')).toBe(
                'Bearer fake-token',
            );
        });
    });
});
