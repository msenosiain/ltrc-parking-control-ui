import {inject,} from '@angular/core';
import {CanActivateFn,} from '@angular/router';
import {map} from 'rxjs';
import {AuthService} from '../auth.service';

export const hasRoleGuard: CanActivateFn = (route) => {
  const allowedRoles: string[] = route.data?.['allowedRoles'];

  return inject(AuthService).user$.pipe(
    map(user => {
      return allowedRoles.some(role => user.roles.includes(role));
    })
  );
};
