import { Component } from '@angular/core';
import { LogoutComponent } from '../../shared/auth/logout/logout.component';

@Component({
    selector: 'app-ticket-list',
    imports: [LogoutComponent],
    templateUrl: './ticket-list.component.html',
    styleUrl: './ticket-list.component.scss',
})
export class TicketListComponent {}
