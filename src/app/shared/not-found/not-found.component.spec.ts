import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NotFoundComponent } from './not-found.component';
import { MockBuilder } from 'ng-mocks';

describe('NotFoundComponent', () => {
    let component: NotFoundComponent;
    let fixture: ComponentFixture<NotFoundComponent>;

    beforeEach(() => MockBuilder(NotFoundComponent));

    beforeEach(() => {
        fixture = TestBed.createComponent(NotFoundComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
