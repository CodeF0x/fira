import { LogoutComponent } from './logout.component';
import { MockBuilder } from 'ng-mocks';
import { LogoutService } from './logout.service';
import { MessageService } from 'primeng/api';
import { Session } from '../../../core/session';
import { Router } from '@angular/router';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { TranslateService } from '@ngx-translate/core';

describe('LogoutComponent', () => {
    let component: LogoutComponent;
    let logoutService: LogoutService;
    let messageService: MessageService;
    let session: Session;
    let router: Router;

    beforeEach(async () => {
        return MockBuilder(LogoutComponent)
            .mock(LogoutService, {
                logout: vi.fn(() => of('')),
            })
            .mock(MessageService, {
                add: vi.fn(),
            })
            .mock(Session, {
                setNewToken: vi.fn(),
            })
            .mock(Router, {
                navigate: vi.fn(),
            })
            .mock(TranslateService, {
                instant: vi.fn((key) => key),
            });
    });

    beforeEach(() => {
        component = TestBed.createComponent(LogoutComponent).componentInstance;
        logoutService = TestBed.inject(LogoutService);
        messageService = TestBed.inject(MessageService);
        session = TestBed.inject(Session);
        router = TestBed.inject(Router);
    });

    describe('onLogout', () => {
        it('should clear session and navigate to login on successful logout', () => {
            component.onLogout();

            expect(session.setNewToken).toHaveBeenCalledWith(null);
            expect(router.navigate).toHaveBeenCalledWith(['/login']);
        });

        it('should show error message on logout failure', () => {
            vi.mocked(logoutService.logout).mockReturnValue(
                throwError(() => new Error()),
            );

            component.onLogout();

            expect(messageService.add).toHaveBeenCalledWith({
                severity: 'error',
                summary: 'PAGE_CONTENT.LOGOUT.MESSAGES.TITLES.ERROR',
                detail: 'PAGE_CONTENT.LOGOUT.MESSAGES.BODIES.ERROR',
                life: 3000,
            });
            expect(session.setNewToken).not.toHaveBeenCalled();
            expect(router.navigate).not.toHaveBeenCalled();
        });
    });
});
