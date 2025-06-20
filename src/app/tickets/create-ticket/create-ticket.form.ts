import { FormControl } from '@angular/forms';
import { TicketLabels } from '../../shared/models/ticket.model';

export enum CreateTicketFormFields {
    TITLE = 'title',
    BODY = 'body',
    LABELS = 'labels',
    ASSIGNED_USER = 'assignedUser',
}

export interface CreateTicketForm {
    [CreateTicketFormFields.TITLE]: FormControl<string>;
    [CreateTicketFormFields.BODY]: FormControl<string>;
    [CreateTicketFormFields.LABELS]: FormControl<TicketLabels>;
    [CreateTicketFormFields.ASSIGNED_USER]: FormControl<string | null>;
}
