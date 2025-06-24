export interface TicketModel {
    id: number;
    title: string;
    body: string;
    created: string;
    lastModified: string;
    labels: Maybe<TicketLabels>;
    assignedUser: number | null;
    status: TicketStatus;
}

export enum TicketLabel {
    FEATURE = 'Feature',
    BUG = 'Bug',
    WONT_FIX = 'WontFix',
    IN_PROGRESS = 'InProgress',
    DONE = 'Done',
}

export enum TicketStatus {
    OPEN = 'Open',
    CLOSED = 'Closed',
}

export type TicketLabels = ReadonlyArray<TicketLabel>;
export type Ticket = Readonly<TicketModel>;
export type Tickets = ReadonlyArray<TicketModel>;
export type CreateTicket = Readonly<
    Omit<TicketModel, 'id' | 'created' | 'lastModified' | 'assignedUser'> & {
        // Rust backend does not like camel-case
        assigned_user: null | number;
    }
>;
export type TicketResponse = Omit<
    TicketModel,
    'assignedUser' | 'lastModified'
> & {
    assigned_user: null | number;
    last_modified: string;
};
