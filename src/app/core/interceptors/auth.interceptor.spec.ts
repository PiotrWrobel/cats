import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { first } from 'rxjs';

import { AuthStoreService } from '../services/store/auth-store.service';
import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  let controller: HttpTestingController;
  const token: string = 'token';

  beforeEach(async () => {
    await MockBuilder()
      .provide({ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true })
      .keep(HttpClientTestingModule)
      .mock(AuthStoreService, { getToken: () => token });
    controller = ngMocks.get(HttpTestingController);
  });

  describe('auth header', () => {
    it('should add auth header to http request', () => {
      const http: HttpClient = ngMocks.get(HttpClient);
      const testUrl: string = 'testUrl';

      http.get(testUrl).pipe(first()).subscribe();

      const testRequest: TestRequest = controller.expectOne(testUrl);
      expect(testRequest.request.headers.get('Authorization')).toBe(`Bearer ${token}`);
    });
  });
});
