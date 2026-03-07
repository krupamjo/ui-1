import { inject, Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  authService = inject(AuthService);

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.authService.user$.pipe(
      switchMap((user) => {
        if (user !== null && !user.expired) {
          return of(true);
        } else {
          return this.authService.login(state.url).pipe(map(() => false));
        }
      })
    );
  }
}
