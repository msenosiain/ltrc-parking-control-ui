import {HttpErrorResponse, HttpHandlerFn, HttpRequest} from '@angular/common/http';
import {inject} from '@angular/core';
import {AuthService} from './auth.service';
import {catchError, switchMap, throwError} from 'rxjs';
import {Router} from '@angular/router';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  const accessToken = authService.getAccessToken();
  // Clone the request to add the authentication header.
  const cloned = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
  });

  return next(cloned).pipe(
    catchError((err) => {
      if (err instanceof HttpErrorResponse && err.status === 401) {
        return authService.refreshToken().pipe(
          switchMap((tokens) => {
            authService.setAccessToken(tokens.access_token);
            const newReq = req.clone({
              headers: req.headers.set('Authorization', `Bearer ${tokens.accessToken}`),
            });
            return next(newReq);
          }),
          catchError((error) => {
            authService.logout();
            router.navigate(['/']);
            return throwError(() => error);
          })
        );
      }
      return throwError(() => err);
    })
  );
}
