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
    };

    const mockUsers: Users = [
        { id: 1, email: 'test@test.com', displayName: 'Test User' },
        { id: 2, email: 'john@doe.com', displayName: 'John Doe' },
    ];

    let fixture: ComponentFixture<CreateTicketComponent>;
    let component: CreateTicketComponent;
    let messageService: MessageService;
    let translateService: TranslateService;
    let ticketsService: TicketsService;

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
            .mock(MessageService),
    );

    beforeEach(() => {
        fixture = TestBed.createComponent(CreateTicketComponent);
        component = fixture.componentInstance;
        messageService = TestBed.inject(MessageService);
        ticketsService = TestBed.inject(TicketsService);
        translateService = TestBed.inject(TranslateService);
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

    it('should submit ticket correctly when form is valid', () => {
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
    });

    it('should handle error on submit', () => {
        vi.spyOn(messageService, 'add');
        vi.spyOn(ticketsService, 'createTicket').mockReturnValue(
            throwError(() => new Error('test error')),
        );
        vi.spyOn(translateService, 'instant').mockImplementation((key) => key);

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
                summary:
                    'PAGE_CONTENT.CREATE_TICKET_PAGE.MESSAGES.TITLES.ERROR',
                detail: 'PAGE_CONTENT.CREATE_TICKET_PAGE.MESSAGES.BODIES.ERROR',
                sticky: false,
                life: 3000,
            }),
        );
    });
});
