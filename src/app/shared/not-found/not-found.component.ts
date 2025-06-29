import { Component, inject } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
    selector: 'app-not-found',
    imports: [ButtonModule, CardModule],
    templateUrl: './not-found.component.html',
    styleUrl: './not-found.component.scss',
})
export class NotFoundComponent {
    private readonly _location = inject(Location);
    private readonly _router = inject(Router);

    goBack(): void {
        // no angular way? This causes the page to flash
        this._location.back();
    }

    goHome(): void {
        this._router.navigate(['/']);
    }
}
