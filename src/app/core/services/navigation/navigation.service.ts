import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { RoutePath } from '~core/services/navigation/path/route-path';

@Injectable({
  providedIn: 'root'
})
export class NavigationService {
  private readonly router: Router = inject(Router);

  public navigateToCatsPage(): Promise<boolean> {
    return this.router.navigate([RoutePath.CATS]);
  }

  public navigateToLoginPage(): Promise<boolean> {
    return this.router.navigate([RoutePath.LOGIN]);
  }
}
