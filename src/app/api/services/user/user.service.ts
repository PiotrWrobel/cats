import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, tap } from 'rxjs';

import { ApiUrls } from '~api/api-urls';
import { AuthStoreService } from '~core/services/store/auth-store.service';

import { AuthorizationResponse } from './model/authorization-response';
import { LoginRequest } from './model/login-request';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly http: HttpClient = inject(HttpClient);
  private readonly store: AuthStoreService = inject(AuthStoreService);
  private readonly _isLoggedIn$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(!!this.store.getToken());

  public login(request: LoginRequest): Observable<void> {
    return this.http.post<AuthorizationResponse>(ApiUrls.userLoginUrl, request).pipe(
      tap((response: AuthorizationResponse) => {
        this.store.storeToken(response.token);
        this._isLoggedIn$.next(true);
      }),
      map(() => void 0)
    );
  }

  public refreshToken(): Observable<void> {
    return this.http.get<AuthorizationResponse>(ApiUrls.refreshTokenUrl).pipe(
      tap((response: AuthorizationResponse) => this.store.storeToken(response.token)),
      map(() => void 0)
    );
  }

  public logout(): Observable<void> {
    return this.http.get<void>(ApiUrls.userLogoutUrl).pipe(
      tap(() => {
        this.store.clearToken();
        this._isLoggedIn$.next(false);
      })
    );
  }

  public get isLoggedIn$(): Observable<boolean> {
    return this._isLoggedIn$;
  }
}
