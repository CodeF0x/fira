import { UserService } from './user.service';
import { MockBuilder } from 'ng-mocks';
import { Config } from '../../core/config';
import { Session } from '../../core/session';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { signal } from '@angular/core';

describe('UserService', () => {
    let service: UserService;
    let httpClient: HttpClient;

    beforeEach(() =>
        MockBuilder(UserService)
            .mock(Config, {
                baseUrl: 'http://test-api',
            })
            .mock(Session, {
                userToken: signal('mock-token'),
            })
            .mock(HttpClient, {
                get: vi.fn().mockReturnValue(
                    of([
                        {
                            id: 1,
                            email: 'test@test.com',
                            display_name: 'Test User',
                        },
                    ]),
                ),
            }),
    );

    beforeEach(() => {
        httpClient = TestBed.inject(HttpClient);

        vi.spyOn(httpClient, 'get');
        service = TestBed.inject(UserService);
    });

    describe('allUsers', () => {
        it('should initialize all users', () => {
            expect(service.allUsers()).toEqual([
                {
                    id: 1,
                    email: 'test@test.com',
                    displayName: 'Test User',
                },
            ]);

            const [url, options] = (httpClient.get as any).mock.calls[0];

            expect(url).toBe('http://test-api/users');
            expect(options.headers.Authorization).toBe('Bearer mock-token');
        });
    });
});
