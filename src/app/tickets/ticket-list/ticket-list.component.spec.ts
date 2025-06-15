import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TicketListComponent } from './ticket-list.component';
import { MockBuilder } from 'ng-mocks';
import { LogoutService } from '../../shared/auth/logout/logout.service';

describe('TicketListComponent', () => {
    let component: TicketListComponent;
    let fixture: ComponentFixture<TicketListComponent>;

    beforeEach(() => MockBuilder(TicketListComponent).mock(LogoutService));

    beforeEach(() => {
        fixture = TestBed.createComponent(TicketListComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
