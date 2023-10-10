import { Routes } from '@angular/router';

import { authGuard } from '~core/guards/auth.guard';
import { RoutePath } from '~core/services/navigation/path/route-path';

export const routes: Routes = [
  {
    path: RoutePath.CATS,
    loadComponent: () =>
      import('./pages/cats/containers/cats-container/cats-container.component').then(c => c.CatsContainerComponent),
    canActivate: [authGuard]
  },
  {
    path: RoutePath.LOGIN,
    loadComponent: () =>
      import('./pages/login/containers/login-container/login-container.component').then(c => c.LoginContainerComponent)
  },
  {
    path: '**',
    redirectTo: RoutePath.CATS
  }
];
