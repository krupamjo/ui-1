import { inject } from '@angular/core';
import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  return inject(AuthService).user$.pipe(switchMap((user) => {
    if (user !== null && !user.expired) {
      req = req.clone({
        setHeaders: {
          Authorization: `Bearer ${user.access_token}`
        },
        withCredentials: true
      });
    }
    return next(req);
  }));
};
