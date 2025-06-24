import {
    Component,
    inject,
    OnInit,
    signal,
    Signal,
    WritableSignal,
} from '@angular/core';
import { CreateTicketForm, CreateTicketFormFields } from './create-ticket.form';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { InputText } from 'primeng/inputtext';
import { FloatLabel } from 'primeng/floatlabel';
import { Editor } from 'primeng/editor';
import { Button } from 'primeng/button';
import { MultiSelect } from 'primeng/multiselect';
import {
    CreateTicket,
    TicketLabel,
    TicketLabels,
    TicketStatus,
} from '../../shared/models/ticket.model';
import { Users } from '../../shared/models/user.model';
import { UserService } from '../../shared/services/user.service';
import { AutoComplete } from 'primeng/autocomplete';
import { Card } from 'primeng/card';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { catchError, EMPTY } from 'rxjs';
import { TicketsService } from '../../shared/services/tickets.service';
import { Toast } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

type LabelMultiSelectOptions = {
    label: TicketLabel;
    display: string;
}[];

@Component({
    selector: 'app-create-ticket',
    imports: [
        ReactiveFormsModule,
        InputText,
        FloatLabel,
        Editor,
        Button,
        MultiSelect,
        AutoComplete,
        Card,
        TranslatePipe,
        Toast,
    ],
    templateUrl: './create-ticket.component.html',
    styleUrl: './create-ticket.component.scss',
    providers: [MessageService],
})
export class CreateTicketComponent implements OnInit {
    readonly CreateTicketFormFields: typeof CreateTicketFormFields =
        CreateTicketFormFields;

    private readonly _translateService: TranslateService =
        inject(TranslateService);

    readonly labels: WritableSignal<LabelMultiSelectOptions> = signal([]);
    readonly availableUsers: Signal<Maybe<Users>> =
        inject(UserService).allUsers;
    readonly filteredUsers: WritableSignal<Users> = signal<Users>([]);
    readonly form: FormGroup<CreateTicketForm> =
        new FormGroup<CreateTicketForm>({
            [CreateTicketFormFields.TITLE]: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            [CreateTicketFormFields.BODY]: new FormControl('', {
                nonNullable: true,
                validators: [Validators.required],
            }),
            [CreateTicketFormFields.LABELS]: new FormControl([], {
                nonNullable: true,
            }),
            [CreateTicketFormFields.ASSIGNED_USER]: new FormControl('', {
                nonNullable: false,
            }),
        });

    private readonly _ticketService: TicketsService = inject(TicketsService);
    private readonly _messageService: MessageService = inject(MessageService);
    private readonly _router: Router = inject(Router);

    // translations are not loaded yet when initializing labels instantly
    ngOnInit() {
        this._translateService
            .get([
                'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.BUG',
                'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.QUESTION',
                'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.FEATURE',
                'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.WONT_FIX',
                'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.IN_PROGRESS',
            ])
            .subscribe((translations) => {
                this.labels.set([
                    {
                        label: TicketLabel.BUG,
                        display:
                            translations[
                                'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.BUG'
                            ],
                    },
                    {
                        label: TicketLabel.DONE,
                        display:
                            translations[
                                'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.QUESTION'
                            ],
                    },
                    {
                        label: TicketLabel.FEATURE,
                        display:
                            translations[
                                'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.FEATURE'
                            ],
                    },
                    {
                        label: TicketLabel.WONT_FIX,
                        display:
                            translations[
                                'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.WONT_FIX'
                            ],
                    },
                    {
                        label: TicketLabel.IN_PROGRESS,
                        display:
                            translations[
                                'PAGE_CONTENT.CREATE_TICKET_PAGE.FORM.LABELS.OPTIONS.IN_PROGRESS'
                            ],
                    },
                ]);
            });
    }

    filterUsers(query?: string): void {
        const allUsers = this.availableUsers();

        if (!allUsers) {
            this.filteredUsers.set([]);
            return;
        }

        const lowercaseQuery = query?.toLowerCase() ?? '';

        const filtered = allUsers.filter(
            (user) =>
                user.displayName.toLowerCase().includes(lowercaseQuery) ||
                user.email.toLowerCase().includes(lowercaseQuery),
        );

        this.filteredUsers.set(filtered);
    }

    onSubmit(): void {
        if (this.form.invalid) {
            return;
        }
        const title: string = this.form.value[CreateTicketFormFields.TITLE]!;
        const body: string = this.form.value[CreateTicketFormFields.BODY]!;
        const labels: TicketLabels =
            this.form.value[CreateTicketFormFields.LABELS]!;
        const assignedUser: null | string =
            this.form.value[CreateTicketFormFields.ASSIGNED_USER]!;
        const newTicket: CreateTicket = {
            title,
            body,
            labels,
            assigned_user:
                this.availableUsers()?.find(
                    (user) => user.email === assignedUser,
                )?.id ?? null,
            status: TicketStatus.OPEN,
        };
        this._ticketService
            .createTicket(newTicket)
            .pipe(
                catchError(() => {
                    this._messageService.add({
                        severity: 'error',
                        summary: this._translateService.instant(
                            'PAGE_CONTENT.CREATE_TICKET_PAGE.MESSAGES.TITLES.ERROR',
                        ),
                        detail: this._translateService.instant(
                            'PAGE_CONTENT.CREATE_TICKET_PAGE.MESSAGES.BODIES.ERROR',
                        ),
                        sticky: false,
                        life: 3000,
                    });

                    return EMPTY;
                }),
            )
            .subscribe(() => this._router.navigate(['']));
    }
}
