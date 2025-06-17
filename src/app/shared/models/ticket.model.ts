export interface TicketModel {
    id: number;
    title: string;
    body: string;
    created: string;
    lastModified: string;
    labels: Maybe<TicketLabels>;
    assignedUser: number;
    status: TicketStatus | null;
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
    Omit<TicketModel, 'id' | 'status' | 'created' | 'lastModified'>
>;
