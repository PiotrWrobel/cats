import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { AuthStoreService } from '../services/store/auth-store.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private readonly store: AuthStoreService = inject(AuthStoreService);

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest: HttpRequest<unknown> = request.clone({
      setHeaders: { Authorization: `Bearer ${this.store.getToken()}` }
    });
    return next.handle(clonedRequest);
  }
}
