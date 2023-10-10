import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from 'src/app/api/api-urls';

import { AuthStoreService } from '../../services/store/auth-store.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly store: AuthStoreService = inject(AuthStoreService);

  private static readonly JSON_FILE: string = '.json';
  private static readonly WHITE_LIST: string[] = [ApiUrls.userLoginUrl, ApiUrls.userLogoutUrl];

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.endsWith(AuthInterceptor.JSON_FILE)) {
      return next.handle(request);
    }

    if (AuthInterceptor.WHITE_LIST.includes(request.url)) {
      return next.handle(request);
    }

    const clonedRequest: HttpRequest<unknown> = request.clone({
      setHeaders: { Authorization: `Bearer ${this.store.getToken()}` }
    });
    return next.handle(clonedRequest);
  }
}
