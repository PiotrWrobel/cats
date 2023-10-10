import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpStatusCode
} from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, switchMap } from 'rxjs';

import { ApiUrls } from '~api/api-urls';
import { UserService } from '~api/services/user/user.service';

import { NavigationService } from '../../services/navigation/navigation.service';

@Injectable()
export class RefreshTokenInterceptor implements HttpInterceptor {
  private readonly userService: UserService = inject(UserService);
  private readonly navigationService: NavigationService = inject(NavigationService);

  private static readonly JSON_FILE: string = '.json';
  private static readonly WHITE_LIST: string[] = [ApiUrls.userLoginUrl, ApiUrls.userLogoutUrl, ApiUrls.refreshTokenUrl];

  public intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    if (request.url.endsWith(RefreshTokenInterceptor.JSON_FILE)) {
      return next.handle(request);
    }

    if (RefreshTokenInterceptor.WHITE_LIST.includes(request.url)) {
      return next.handle(request);
    }

    return this.userService.refreshToken().pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Unauthorized || error.status === HttpStatusCode.Forbidden) {
          this.navigationService.navigateToLoginPage();
        }
        throw error;
      }),
      switchMap(() => next.handle(request))
    );
  }
}
