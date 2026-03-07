import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { describe, it, expect, beforeEach } from 'vitest';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: { navigate: () => {}, navigateByUrl: () => {} } },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: { get: () => null } } },
        },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have user$ BehaviorSubject', () => {
    expect(service.user$).toBeTruthy();
    expect(service.user$.value).toBe(null);
  });

  it('should have a login method', () => {
    expect(typeof service.login).toBe('function');
  });

  it('should have a logout method', () => {
    expect(typeof service.logout).toBe('function');
  });

  it('should have a loginCallback method', () => {
    expect(typeof service.loginCallback).toBe('function');
  });

  it('should have a getUser method', () => {
    expect(typeof service.getUser).toBe('function');
  });

  it('should have a key property for returnUrl', () => {
    expect(service.key).toBe('returnUrl');
  });
});
