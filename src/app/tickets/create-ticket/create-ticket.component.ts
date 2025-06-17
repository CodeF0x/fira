import { Component } from '@angular/core';
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
} from '../../shared/models/ticket.model';

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
        MultiSelect,
    ],
    templateUrl: './create-ticket.component.html',
    styleUrl: './create-ticket.component.scss',
})
export class CreateTicketComponent {
    readonly CreateTicketFormFields: typeof CreateTicketFormFields =
        CreateTicketFormFields;

    readonly labels: LabelMultiSelectOptions = [
        { label: TicketLabel.BUG, display: 'Bug' },
        { label: TicketLabel.DONE, display: 'Question' },
        { label: TicketLabel.FEATURE, display: 'Feature' },
        { label: TicketLabel.FEATURE, display: 'Feature' },
        { label: TicketLabel.WONT_FIX, display: 'Wont fix' },
        { label: TicketLabel.IN_PROGRESS, display: 'In progress' },
    ];
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
            [CreateTicketFormFields.ASSIGNED_USER]: new FormControl(null, {
                nonNullable: false,
            }),
        });

    onSubmit(): void {
        if (this.form.invalid) {
            return;
        }
        const title: string = this.form.value[CreateTicketFormFields.TITLE]!;
        const body: string = this.form.value[CreateTicketFormFields.BODY]!;
        const labels: TicketLabels =
            this.form.value[CreateTicketFormFields.LABELS]!;
        const assignedUser: null | number =
            this.form.value[CreateTicketFormFields.ASSIGNED_USER]!;
        const newTicket: CreateTicket = {
            title,
            body,
            labels,
            assignedUser,
        };
        console.log(newTicket);
    }
}
