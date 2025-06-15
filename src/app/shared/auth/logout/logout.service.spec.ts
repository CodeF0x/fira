import { MockBuilder, MockService } from 'ng-mocks';
import { LogoutService } from './logout.service';
import { HttpClient } from '@angular/common/http';
import { Session } from '../../../core/session';
import { Config } from '../../../core/config';
import { describe, beforeEach, it, expect, vi } from 'vitest';
import { of } from 'rxjs';
import { TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';

describe('LogoutService', () => {
    let service: LogoutService;
    let http: HttpClient;

    beforeEach(async () => {
        return MockBuilder(LogoutService)
            .provide({
                provide: Config,
                useValue: MockService(Config, {
                    baseUrl: 'http://test-api',
                }),
            })
            .provide({
                provide: Session,
                useValue: MockService(Session, {
                    userToken: signal('test-token'),
                }),
            })
            .mock(HttpClient, {
                post: vi.fn().mockReturnValue(of('success')),
            });
    });

    beforeEach(() => {
        service = TestBed.inject(LogoutService);
        http = TestBed.inject(HttpClient);
    });

    describe('logout', () => {
        it('should send logout request with bearer token', () => {
            service.logout().subscribe();

            const [url, body, options] = (http.post as any).mock.calls[0];

            expect(url).toBe('http://test-api/logout');
            expect(body).toBeNull();
            expect(options.responseType).toBe('text');
            expect(options.headers.get('Authorization')).toBe(
                'Bearer test-token',
            );
        });
    });
});
