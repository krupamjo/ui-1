import { TestBed } from '@angular/core/testing';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { HttpClient, HttpErrorResponse, provideHttpClient, withInterceptors } from '@angular/common/http';
import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../auth/auth.service';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

describe('errorInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authService: { login: ReturnType<typeof vi.fn> };
  let router: { navigate: ReturnType<typeof vi.fn> };

  beforeEach(() => {
    const mockAuthService = {
      login: vi.fn().mockReturnValue(of(undefined)),
    };
    const mockRouter = {
      navigate: vi.fn(),
    };

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([errorInterceptor])),
        provideHttpClientTesting(),
        { provide: AuthService, useValue: mockAuthService },
        { provide: Router, useValue: mockRouter },
      ],
    });

    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
    authService = TestBed.inject(AuthService) as any;
    router = TestBed.inject(Router) as any;
  });

  it('should handle 401 error', () => {
    httpClient.get('/api/test').subscribe(
      () => {},
      () => {}
    );

    const req = httpMock.expectOne('/api/test');
    req.flush('Unauthorized', { status: 401, statusText: 'Unauthorized' });

    expect(authService.login).toHaveBeenCalled();
  });

  it('should handle 403 error', () => {
    httpClient.get('/api/test').subscribe(
      () => {},
      () => {}
    );

    const req = httpMock.expectOne('/api/test');
    req.flush('Forbidden', { status: 403, statusText: 'Forbidden' });

    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  it('should rethrow error after handling', async () => {
    const errorPromise = new Promise<HttpErrorResponse>((resolve) => {
      httpClient.get('/api/test').subscribe(
        () => {},
        (error) => {
          resolve(error);
        }
      );
    });

    const req = httpMock.expectOne('/api/test');
    req.flush('Server Error', { status: 500, statusText: 'Server Error' });

    const thrownError = await errorPromise;
    expect(thrownError?.status).toBe(500);
  });

  afterEach(() => {
    httpMock.verify();
  });
});
