import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { first } from 'rxjs';

import { AuthStoreService } from '../../../core/services/store/auth-store.service';
import { LoginRequest } from './model/login-request';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;
  let controller: HttpTestingController;
  let spyAuthStoreService: jasmine.SpyObj<AuthStoreService>;

  setUp();

  describe('service init on missing token', () => {
    setUp();

    it('should create UserService', () => {
      expect(service).toBeTruthy();
    });

    it('should not set login flag to true on missing token', (done: DoneFn) => {
      service.isLoggedIn$.pipe(first()).subscribe((isLoggedIn: boolean) => {
        expect(isLoggedIn).toBeFalse();
        done();
      });
    });
  });

  describe('service init on stored token', () => {
    setUp('abc');

    it('should set login flag to true on stored token', (done: DoneFn) => {
      service.isLoggedIn$.pipe(first()).subscribe((isLoggedIn: boolean) => {
        expect(isLoggedIn).toBeTrue();
        done();
      });
    });
  });

  describe('methods', () => {
    setUp();

    it('should login user', (done: DoneFn) => {
      const token: string = 'token';
      const loginRequest: LoginRequest = { username: 'username', password: 'password' };
      service.login(loginRequest).pipe(first()).subscribe();

      const testRequest: TestRequest = controller.expectOne('/user/login');
      expect(testRequest.request.body).toBe(loginRequest);
      expect(testRequest.request.method).toBe('POST');

      testRequest.flush({ token });
      expect(spyAuthStoreService.storeToken).toHaveBeenCalledOnceWith(token);
      service.isLoggedIn$.pipe(first()).subscribe((isLoggedIn: boolean) => {
        expect(isLoggedIn).toBeTrue();
        done();
      });
    });

    it('should logout user', () => {
      service.logout().pipe(first()).subscribe();

      const testRequest: TestRequest = controller.expectOne('/user/logout');
      expect(testRequest.request.method).toBe('GET');
    });

    it('should refresh token', () => {
      const newToken: string = 'token';
      service.refreshToken().pipe(first()).subscribe();

      const testRequest: TestRequest = controller.expectOne('/user/refresh-token');
      expect(testRequest.request.method).toBe('GET');

      testRequest.flush({ token: newToken });
      expect(spyAuthStoreService.storeToken).toHaveBeenCalledOnceWith(newToken);
    });
  });

  function setUp(token: string | null = null): void {
    spyAuthStoreService = jasmine.createSpyObj('AuthStoreService', ['getToken', 'storeToken']);

    beforeEach(async (): Promise<void> => {
      await MockBuilder(UserService).keep(HttpClientTestingModule).mock(AuthStoreService, spyAuthStoreService);
      spyAuthStoreService.getToken.and.returnValue(token);
      spyAuthStoreService.storeToken.calls.reset();

      controller = ngMocks.get(HttpTestingController);
      service = ngMocks.get(UserService);
    });
  }
});
