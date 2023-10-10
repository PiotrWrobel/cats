import { inject, Injectable } from '@angular/core';

import { WindowProviderService } from '../window/window-provider.service';

@Injectable({
  providedIn: 'root'
})
export class AuthStoreService {
  private readonly providedWindow: Window = inject(WindowProviderService).window;

  private static readonly TOKEN_KEY: string = 'tokenKey';

  public storeToken(token: string): void {
    this.providedWindow.localStorage.setItem(AuthStoreService.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    return this.providedWindow.localStorage.getItem(AuthStoreService.TOKEN_KEY);
  }

  public clearToken(): void {
    this.providedWindow.localStorage.removeItem(AuthStoreService.TOKEN_KEY);
  }
}
