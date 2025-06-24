import { beforeEach, describe, expect, it, vi } from 'vitest';
import { CreateTicketComponent } from './create-ticket.component';
import { MockBuilder } from 'ng-mocks';
import { TranslateService } from '@ngx-translate/core';
import { UserService } from '../../shared/services/user.service';
import { TicketsService } from '../../shared/services/tickets.service';
import { of, throwError } from 'rxjs';
import { CreateTicketFormFields } from './create-ticket.form';
import { TicketLabel, TicketStatus } from '../../shared/models/ticket.model';
import { Users } from '../../shared/models/user.model';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

describe('CreateTicketComponent', () => {
    const mockTranslations: Record<string, string> = {
        'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.BUG': 'Bug',
        'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.QUESTION':
            'Question',
        'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.FEATURE':
            'Feature',
        'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.WONT_FIX':
            'Wont fix',
        'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.IN_PROGRESS':
            'In progress',
        'PAGE_CONTENT.CREATE_TICKET_PAGE.MESSAGES.TITLES.ERROR': 'Error Title',
        'PAGE_CONTENT.CREATE_TICKET_PAGE.MESSAGES.BODIES.ERROR': 'Error Body',
    };

    const mockUsers: Users = [
        { id: 1, email: 'test@test.com', displayName: 'Test User' },
        { id: 2, email: 'john@doe.com', displayName: 'John Doe' },
    ];

    let fixture: ComponentFixture<CreateTicketComponent>;
    let component: CreateTicketComponent;
    let messageService: MessageService;
    let ticketsService: TicketsService;
    let router: Router;

    beforeEach(() =>
        MockBuilder(CreateTicketComponent)
            .provide({
                provide: TranslateService,
                useValue: {
                    get: vi.fn().mockReturnValue(of(mockTranslations)),
                    instant: vi
                        .fn()
                        .mockImplementation(
                            (key: string) => mockTranslations[key],
                        ),
                },
            })
            .provide({
                provide: UserService,
                useValue: {
                    allUsers: () => mockUsers,
                },
            })
            .provide({
                provide: TicketsService,
                useValue: {
                    createTicket: vi.fn().mockReturnValue(of({})),
                },
            })
            .mock(MessageService, {
                add: vi.fn(),
            })
            .mock(Router, {
                navigate: vi.fn(),
            }),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateTicketComponent);
        component = fixture.componentInstance;
        messageService = TestBed.inject(MessageService);
        ticketsService = TestBed.inject(TicketsService);
        router = TestBed.inject(Router);
    });

    it('should initialize labels with translations', () => {
        component.ngOnInit();

        expect(component.labels()).toEqual([
            { label: TicketLabel.BUG, display: 'Bug' },
            { label: TicketLabel.DONE, display: 'Question' },
            { label: TicketLabel.FEATURE, display: 'Feature' },
            { label: TicketLabel.WONT_FIX, display: 'Wont fix' },
            { label: TicketLabel.IN_PROGRESS, display: 'In progress' },
        ]);
    });

    it('should filter users correctly', () => {
        component.filterUsers('test');
        expect(component.filteredUsers()).toEqual([mockUsers[0]]);

        component.filterUsers('john');
        expect(component.filteredUsers()).toEqual([mockUsers[1]]);

        component.filterUsers('');
        expect(component.filteredUsers()).toEqual(mockUsers);
    });

    it('should not submit if form is invalid', () => {
        component.onSubmit();
        expect(ticketsService.createTicket).not.toHaveBeenCalled();
    });

    it('should submit ticket correctly when form is valid and redirect to tickets list', () => {
        vi.spyOn(router, 'navigate');

        component.form.setValue({
            [CreateTicketFormFields.TITLE]: 'Test Title',
            [CreateTicketFormFields.BODY]: 'Test Body',
            [CreateTicketFormFields.LABELS]: [TicketLabel.BUG],
            [CreateTicketFormFields.ASSIGNED_USER]: 'test@test.com',
        });

        component.onSubmit();

        expect(ticketsService.createTicket).toHaveBeenCalledWith({
            title: 'Test Title',
            body: 'Test Body',
            labels: [TicketLabel.BUG],
            assigned_user: 1,
            status: TicketStatus.OPEN,
        });
        expect(router.navigate).toHaveBeenCalledWith(['']);
    });

    it('should handle error on submit', () => {
        vi.spyOn(ticketsService, 'createTicket').mockReturnValueOnce(
            throwError(() => new HttpErrorResponse({ status: 500 })),
        );

        component.form.setValue({
            [CreateTicketFormFields.TITLE]: 'Test Title',
            [CreateTicketFormFields.BODY]: 'Test Body',
            [CreateTicketFormFields.LABELS]: [TicketLabel.BUG],
            [CreateTicketFormFields.ASSIGNED_USER]: 'test@test.com',
        });

        component.onSubmit();

        expect(ticketsService.createTicket).toHaveBeenCalled();
        expect(messageService.add).toHaveBeenCalledWith(
            expect.objectContaining({
                severity: 'error',
                summary: 'Error Title',
                detail: 'Error Body',
                sticky: false,
                life: 3000,
            }),
        );
    });
});
