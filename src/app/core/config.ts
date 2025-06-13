import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class Config {
    readonly baseUrl: string = 'http://localhost:8080/api';
}
