import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { authInterceptor } from '../auth/auth.interceptor';
import { errorInterceptor } from '../error/error.interceptor';
import { routes } from './app.routes';
import { AuthService } from '../auth/auth.service';
import { map } from 'rxjs';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
    provideAppInitializer(() => {
      const authService = inject(AuthService);
      return authService.getUser().pipe(map(user => authService.user$.next(user)));
    })
  ]
};
