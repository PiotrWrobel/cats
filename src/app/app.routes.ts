import { Routes } from '@angular/router';

export enum RuthePath {
  CATS = 'cats'
}

export const routes: Routes = [
  {
    path: RuthePath.CATS,
    loadComponent: () =>
      import('./pages/cats/containers/cats-container/cats-container.component').then(c => c.CatsContainerComponent)
  },
  {
    path: '**',
    redirectTo: RuthePath.CATS
  }
];
