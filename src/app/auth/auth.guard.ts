import {inject} from '@angular/core';
import {CanActivateFn, Router} from '@angular/router';
import {AuthService} from './auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    console.log('logged in');
    return true;
  } else {
    // router.navigate(['/login']);
    authService.loginWithGoogle();
    return false;
  }
};
