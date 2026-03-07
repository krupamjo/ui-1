import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './auth.interceptor';
import { AuthService } from './auth.service';
import { BehaviorSubject } from 'rxjs';
import { User } from 'oidc-client';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: { user$: BehaviorSubject<User | null> };
  let userSubject: BehaviorSubject<User | null>;

  beforeEach(() => {
    userSubject = new BehaviorSubject<User | null>(null);
    const mockAuthService = { user$: userSubject };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService) as any;
  });

  it('should add Authorization header when user is logged in', () => {
    const mockUser = {
      access_token: 'test-token-123',
      expired: false,
    } as User;

    userSubject.next(mockUser);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe(
      'Bearer test-token-123'
    );
    expect(req.request.withCredentials).toBe(true);

    req.flush({});
  });

  it('should not add Authorization header when user is null', () => {
    userSubject.next(null);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });

  it('should not add Authorization header when user is expired', () => {
    const mockUser = {
      access_token: 'test-token-123',
      expired: true,
    } as User;

    userSubject.next(mockUser);

    httpClient.get('/api/test').subscribe();

    const req = httpMock.expectOne('/api/test');
    expect(req.request.headers.has('Authorization')).toBe(false);

    req.flush({});
  });

  afterEach(() => {
    httpMock.verify();
  });
});
