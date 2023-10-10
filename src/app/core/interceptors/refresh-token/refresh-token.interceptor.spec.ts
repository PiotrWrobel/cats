import { HTTP_INTERCEPTORS, HttpClient, HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { first, of, throwError } from 'rxjs';

import { ApiUrls } from '../../../api/api-urls';
import { UserService } from '../../../api/services/user/user.service';
import { NavigationService } from '../../services/navigation/navigation.service';
import { AuthStoreService } from '../../services/store/auth-store.service';
import { RefreshTokenInterceptor } from './refresh-token.interceptor';

describe('RefreshTokenInterceptor', () => {
  let spyUserService: jasmine.SpyObj<UserService>;
  let spyNavigationService: jasmine.SpyObj<NavigationService>;

  beforeEach(() => {
    spyUserService = jasmine.createSpyObj('UserService', ['refreshToken']);
    spyNavigationService = jasmine.createSpyObj('NavigationService', ['navigateToLoginPage']);

    return MockBuilder()
      .provide({ provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true })
      .keep(HttpClientTestingModule)
      .mock(UserService, spyUserService)
      .mock(NavigationService, spyNavigationService)
      .mock(AuthStoreService, { getToken: () => 'abc' });
  });

  describe('refresh token', () => {
    beforeEach(() => {
      spyUserService.refreshToken.calls.reset();
      spyNavigationService.navigateToLoginPage.and.returnValue(Promise.resolve(true));
      spyNavigationService.navigateToLoginPage.calls.reset();
    });

    it('should refresh token before http call', () => {
      const http: HttpClient = ngMocks.get(HttpClient);
      spyUserService.refreshToken.and.returnValue(of(void 0));
      http.get('abc').pipe(first()).subscribe();

      expect(spyUserService.refreshToken).toHaveBeenCalledTimes(1);
    });

    it('should not refresh token on json files', () => {
      const http: HttpClient = ngMocks.get(HttpClient);
      spyUserService.refreshToken.and.returnValue(of(void 0));
      http.get('abc.json').pipe(first()).subscribe();

      expect(spyUserService.refreshToken).toHaveBeenCalledTimes(0);
    });

    it('should not refresh token on login', () => {
      const http: HttpClient = ngMocks.get(HttpClient);
      spyUserService.refreshToken.and.returnValue(of(void 0));
      http.get(ApiUrls.userLoginUrl).pipe(first()).subscribe();

      expect(spyUserService.refreshToken).toHaveBeenCalledTimes(0);
    });

    it('should not refresh token on logout', () => {
      const http: HttpClient = ngMocks.get(HttpClient);
      spyUserService.refreshToken.and.returnValue(of(void 0));
      http.get(ApiUrls.userLogoutUrl).pipe(first()).subscribe();

      expect(spyUserService.refreshToken).toHaveBeenCalledTimes(0);
    });

    it('should not refresh token on self', () => {
      const http: HttpClient = ngMocks.get(HttpClient);
      spyUserService.refreshToken.and.returnValue(of(void 0));
      http.get(ApiUrls.refreshTokenUrl).pipe(first()).subscribe();

      expect(spyUserService.refreshToken).toHaveBeenCalledTimes(0);
    });

    it('should navigate to login screen and clear store on 401 error', () => {
      const http: HttpClient = ngMocks.get(HttpClient);
      spyUserService.refreshToken.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: HttpStatusCode.Unauthorized }))
      );
      http
        .get('abc')
        .pipe(first())
        .subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error.status).toBe(HttpStatusCode.Unauthorized);
          }
        });

      expect(spyNavigationService.navigateToLoginPage).toHaveBeenCalledTimes(1);
    });

    it('should navigate to login screen and clear store on 403 error', () => {
      const http: HttpClient = ngMocks.get(HttpClient);
      spyUserService.refreshToken.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: HttpStatusCode.Forbidden }))
      );
      http
        .get('abc')
        .pipe(first())
        .subscribe({
          error: (error: HttpErrorResponse) => {
            expect(error.status).toBe(HttpStatusCode.Forbidden);
          }
        });

      expect(spyNavigationService.navigateToLoginPage).toHaveBeenCalledTimes(1);
    });

    it('should not navigate to login screen and clear store on other error', () => {
      const http: HttpClient = ngMocks.get(HttpClient);
      spyUserService.refreshToken.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: HttpStatusCode.InternalServerError }))
      );
      http
        .get('abc')
        .pipe(first())
        .subscribe({
          error: () => {
            expect(spyNavigationService.navigateToLoginPage).toHaveBeenCalledTimes(0);
          }
        });
    });
  });
});
