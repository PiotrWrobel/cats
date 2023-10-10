import { inject } from '@angular/core';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { map, Observable } from 'rxjs';

import { UserService } from '~api/services/user/user.service';
import { RoutePath } from '~core/services/navigation/path/route-path';

export const authGuard: CanActivateFn = (): Observable<boolean | UrlTree> => {
  const userService: UserService = inject(UserService);
  const router: Router = inject(Router);

  return userService.isLoggedIn$.pipe(
    map((value: boolean) => {
      return value ? true : router.parseUrl(RoutePath.LOGIN);
    })
  );
};
