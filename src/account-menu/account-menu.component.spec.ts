import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AccountMenuComponent } from './account-menu.component';
import { AuthService } from '../auth/auth.service';
import { BehaviorSubject, of } from 'rxjs';
import { User } from 'oidc-client';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('AccountMenuComponent', () => {
  let component: AccountMenuComponent;
  let fixture: ComponentFixture<AccountMenuComponent>;
  let authService: AuthService;
  let userSubject: BehaviorSubject<User | null>;

  beforeEach(async () => {
    userSubject = new BehaviorSubject<User | null>(null);
    const mockAuthService = {
      user$: userSubject,
      login: vi.fn().mockReturnValue(of(undefined)),
      logout: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [AccountMenuComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(AccountMenuComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize user$ from authService', () => {
    expect(component.user$).toBe(userSubject);
  });

  it('should initialize isLoggedIn$ as false when user is null', async () => {
    userSubject.next(null);

    const result = await new Promise<boolean>((resolve) => {
      component.isLoggedIn$.subscribe((isLoggedIn) => {
        resolve(isLoggedIn);
      });
    });

    expect(result).toBe(false);
  });

  it('should emit true for isLoggedIn$ when user is logged in', async () => {
    const mockUser = {
      profile: { name: 'Test User' },
      access_token: 'token',
      expired: false,
    } as User;

    userSubject.next(mockUser);

    const result = await new Promise<boolean>((resolve) => {
      component.isLoggedIn$.subscribe((isLoggedIn) => {
        resolve(isLoggedIn);
      });
    });

    expect(result).toBe(true);
  });

  it('should emit false for isLoggedIn$ when user is expired', async () => {
    const mockUser = {
      profile: { name: 'Test User' },
      access_token: 'token',
      expired: true,
    } as User;

    userSubject.next(mockUser);

    const result = await new Promise<boolean>((resolve) => {
      component.isLoggedIn$.subscribe((isLoggedIn) => {
        resolve(isLoggedIn);
      });
    });

    expect(result).toBe(false);
  });

  it('should call authService.login when login is called', () => {
    component.login();
    expect(authService.login).toHaveBeenCalled();
  });

  it('should call authService.logout when logout is called', () => {
    component.logout();
    expect(authService.logout).toHaveBeenCalled();
  });
});
