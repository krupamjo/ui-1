import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { User } from 'oidc-client';
import { firstValueFrom } from 'rxjs';

const { mockMgr, mockEvents } = vi.hoisted(() => {
  const mockEvents = { addUserSignedOut: vi.fn() };
  const mockMgr = {
    events: mockEvents,
    getUser: vi.fn(),
    signinRedirect: vi.fn(),
    signinRedirectCallback: vi.fn(),
    signoutRedirect: vi.fn(),
  };
  return { mockMgr, mockEvents };
});

vi.mock('oidc-client', () => ({
  UserManager: vi.fn(function () { return mockMgr; }),
}));

describe('AuthService', () => {
  let service: AuthService;
  let mockRouter: { navigate: ReturnType<typeof vi.fn>; navigateByUrl: ReturnType<typeof vi.fn> };
  let mockRouteGet: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    vi.clearAllMocks();
    mockMgr.getUser.mockResolvedValue(null);
    mockMgr.signinRedirect.mockResolvedValue(undefined);
    mockMgr.signinRedirectCallback.mockResolvedValue({ access_token: 'token' } as User);
    mockMgr.signoutRedirect.mockResolvedValue(undefined);

    mockRouter = { navigate: vi.fn(), navigateByUrl: vi.fn() };
    mockRouteGet = vi.fn().mockReturnValue(null);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: { snapshot: { queryParamMap: { get: mockRouteGet } } } },
      ],
    });

    service = TestBed.inject(AuthService);
  });

  afterEach(() => {
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have user$ BehaviorSubject initialized to null', () => {
    expect(service.user$).toBeTruthy();
    expect(service.user$.value).toBeNull();
  });

  it('should have a key property for returnUrl', () => {
    expect(service.key).toBe('returnUrl');
  });

  describe('getUser()', () => {
    it('should call mgr.getUser and return the user', async () => {
      const mockUser = { access_token: 'test-token' } as User;
      mockMgr.getUser.mockResolvedValue(mockUser);

      const user = await firstValueFrom(service.getUser());

      expect(mockMgr.getUser).toHaveBeenCalled();
      expect(user).toEqual(mockUser);
    });

    it('should return null when no user is logged in', async () => {
      mockMgr.getUser.mockResolvedValue(null);

      const user = await firstValueFrom(service.getUser());

      expect(user).toBeNull();
    });
  });

  describe('login()', () => {
    it('should call signinRedirect', async () => {
      await firstValueFrom(service.login());

      expect(mockMgr.signinRedirect).toHaveBeenCalled();
    });

    it('should store returnUrl in sessionStorage when provided', async () => {
      await firstValueFrom(service.login('/pets'));

      expect(sessionStorage.getItem('returnUrl')).toBe('/pets');
    });

    it('should remove returnUrl from sessionStorage when not provided', async () => {
      sessionStorage.setItem('returnUrl', '/pets');

      await firstValueFrom(service.login(null));

      expect(sessionStorage.getItem('returnUrl')).toBeNull();
    });

    it('should use returnUrl from query params when no argument given', async () => {
      mockRouteGet.mockReturnValue('/from-query');

      await firstValueFrom(service.login());

      expect(sessionStorage.getItem('returnUrl')).toBe('/from-query');
    });
  });

  describe('loginCallback()', () => {
    it('should call signinRedirectCallback and update user$', async () => {
      const mockUser = { access_token: 'callback-token' } as User;
      mockMgr.signinRedirectCallback.mockResolvedValue(mockUser);

      const user = await firstValueFrom(service.loginCallback());

      expect(mockMgr.signinRedirectCallback).toHaveBeenCalled();
      expect(service.user$.value).toEqual(mockUser);
      expect(user).toEqual(mockUser);
    });

    it('should navigate to returnUrl from sessionStorage and clear it', async () => {
      sessionStorage.setItem('returnUrl', '/pets');

      await firstValueFrom(service.loginCallback());

      expect(mockRouter.navigateByUrl).toHaveBeenCalledWith('/pets');
      expect(sessionStorage.getItem('returnUrl')).toBeNull();
    });

    it('should navigate to / when no returnUrl in sessionStorage', async () => {
      await firstValueFrom(service.loginCallback());

      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });

  describe('logout()', () => {
    it('should call signoutRedirect', async () => {
      await firstValueFrom(service.logout());

      expect(mockMgr.signoutRedirect).toHaveBeenCalled();
    });

    it('should set user$ to null', async () => {
      service.user$.next({ access_token: 'token' } as User);

      await firstValueFrom(service.logout());

      expect(service.user$.value).toBeNull();
    });
  });

  describe('UserSignedOut event', () => {
    it('should set user$ to null and navigate to / when user signs out', () => {
      const signedOutCallback = mockEvents.addUserSignedOut.mock.calls[0][0];
      service.user$.next({ access_token: 'token' } as User);

      signedOutCallback();

      expect(service.user$.value).toBeNull();
      expect(mockRouter.navigate).toHaveBeenCalledWith(['/']);
    });
  });
});
