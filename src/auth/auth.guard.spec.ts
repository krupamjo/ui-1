import { TestBed } from '@angular/core/testing';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { User } from 'oidc-client';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let authService: AuthService;
  let userSubject: BehaviorSubject<User | null>;

  beforeEach(() => {
    userSubject = new BehaviorSubject<User | null>(null);

    const mockAuthService = {
      user$: userSubject,
      login: vi.fn().mockReturnValue(of(undefined)),
    };

    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: AuthService, useValue: mockAuthService },
      ],
    });

    guard = TestBed.inject(AuthGuard);
    authService = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should return true when user is logged in and not expired', async () => {
    const mockUser = {
      access_token: 'token',
      expired: false,
    } as User;

    userSubject.next(mockUser);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/pets' } as RouterStateSnapshot;

    const result = await new Promise<boolean | any>((resolve) => {
      guard.canActivate(route, state).subscribe((result) => {
        resolve(result);
      });
    });

    expect(result).toBe(true);
  });

  it('should call login and return false when user is null', async () => {
    userSubject.next(null);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/pets' } as RouterStateSnapshot;

    const result = await new Promise<boolean | any>((resolve) => {
      guard.canActivate(route, state).subscribe((result) => {
        resolve(result);
      });
    });

    expect(result).toBe(false);
    expect(authService.login).toHaveBeenCalledWith('/pets');
  });

  it('should call login and return false when user is expired', async () => {
    const mockUser = {
      access_token: 'token',
      expired: true,
    } as User;

    userSubject.next(mockUser);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/pets' } as RouterStateSnapshot;

    const result = await new Promise<boolean | any>((resolve) => {
      guard.canActivate(route, state).subscribe((result) => {
        resolve(result);
      });
    });

    expect(result).toBe(false);
    expect(authService.login).toHaveBeenCalledWith('/pets');
  });

  it('should pass the state url to login', async () => {
    userSubject.next(null);

    const route = {} as ActivatedRouteSnapshot;
    const state = { url: '/settings' } as RouterStateSnapshot;

    await new Promise<void>((resolve) => {
      guard.canActivate(route, state).subscribe(() => {
        resolve();
      });
    });

    expect(authService.login).toHaveBeenCalledWith('/settings');
  });
});
