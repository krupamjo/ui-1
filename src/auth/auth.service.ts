import { inject, Injectable } from '@angular/core';
import { User, UserManager, UserManagerSettings } from 'oidc-client';
import { BehaviorSubject, Observable, from, map, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  route = inject(ActivatedRoute);
  router = inject(Router);
  private readonly config: UserManagerSettings;
  private readonly mgr: UserManager;
  key = 'returnUrl';

  public user$: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  constructor() {
    this.config = {
      authority: environment.authUrl,
      client_id: "krupamjo-ui-1",
      redirect_uri: environment.redirectUrl,
      response_type: "id_token token",
      scope: "openid profile email krupamjo-api-1",
      post_logout_redirect_uri: environment.postLogoutRedirectUrl,
    };
    this.mgr = new UserManager(this.config);
    this.mgr.events.addUserSignedOut(() => {
      this.user$.next(null);
      this.router.navigate(['/'])
    });
  }

  getUser(): Observable<User | null> {
    return from(this.mgr.getUser());
  }

  login(returnUrl: string | null = null): Observable<void> {
    returnUrl = returnUrl ?? this.route.snapshot.queryParamMap.get(this.key);
    if (returnUrl) {
      sessionStorage.setItem(this.key, returnUrl);
    } else {
      sessionStorage.removeItem(this.key);
    }
    return from(this.mgr.signinRedirect());
  }

  loginCallback(): Observable<User> {
    const returnUrl = sessionStorage.getItem(this.key);
    return from(this.mgr.signinRedirectCallback()).pipe(
      map(user => {
        this.user$.next(user)
        if (returnUrl) {
          sessionStorage.removeItem(this.key);
          this.router.navigateByUrl(returnUrl);
        } else {
          this.router.navigate(['/']);
        }
        return user;
      }));
  }

  logout(): Observable<void> {
    return from(this.mgr.signoutRedirect()).pipe(tap(() => this.user$.next(null)))  ;
  }

}
