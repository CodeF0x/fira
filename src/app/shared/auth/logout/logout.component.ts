import { Component, inject } from '@angular/core';
import { Button } from 'primeng/button';
import { LogoutService } from './logout.service';
import { catchError, EMPTY } from 'rxjs';
import { MessageService } from 'primeng/api';
import { Session } from '../../../core/session';
import { Router } from '@angular/router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-logout',
    imports: [Button, TranslatePipe],
    templateUrl: './logout.component.html',
    styleUrl: './logout.component.scss',
    providers: [LogoutService, MessageService],
})
export class LogoutComponent {
    private readonly _logoutService: LogoutService = inject(LogoutService);
    private readonly _messageService: MessageService = inject(MessageService);
    private readonly _session: Session = inject(Session);
    private readonly _router: Router = inject(Router);
    private readonly _translateService: TranslateService =
        inject(TranslateService);

    onLogout(): void {
        this._logoutService
            .logout()
            .pipe(
                catchError(() => {
                    this._messageService.add({
                        severity: 'error',
                        summary: this._translateService.instant(
                            'PAGE_CONTENT.LOGOUT.MESSAGES.TITLES.ERROR',
                        ),
                        detail: this._translateService.instant(
                            'PAGE_CONTENT.LOGOUT.MESSAGES.BODIES.ERROR',
                        ),
                        life: 3000,
                    });

                    return EMPTY;
                }),
            )
            .subscribe(() => {
                this._session.setNewToken(null);
                this._router.navigate(['/login']);
            });
    }
}
