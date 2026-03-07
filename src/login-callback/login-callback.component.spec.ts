import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginCallbackComponent } from './login-callback.component';
import { AuthService } from '../auth/auth.service';
import { of } from 'rxjs';
import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('LoginCallbackComponent', () => {
  let component: LoginCallbackComponent;
  let fixture: ComponentFixture<LoginCallbackComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    const mockAuthService = {
      loginCallback: vi.fn().mockReturnValue(of(undefined)),
    };

    await TestBed.configureTestingModule({
      imports: [LoginCallbackComponent],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginCallbackComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call loginCallback on init', () => {
    fixture.detectChanges();
    expect(authService.loginCallback).toHaveBeenCalled();
  });

  it('should subscribe to loginCallback subscription', () => {
    const loginCallbackSpy = vi.spyOn(authService, 'loginCallback');
    fixture.detectChanges();
    expect(loginCallbackSpy).toHaveBeenCalled();
  });
});
