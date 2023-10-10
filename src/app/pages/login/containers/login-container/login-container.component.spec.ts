import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { UserService } from '../../../../api/services/user/user.service';
import { NavigationService } from '../../../../core/services/navigation/navigation.service';
import { LoginFormBuilderService } from './form-builder/login-form-builder.service';
import { LoginContainerComponent } from './login-container.component';

describe('LoginContainerComponent', () => {
  let component: LoginContainerComponent;
  let spyUserService: jasmine.SpyObj<UserService>;
  let spyNavigationService: jasmine.SpyObj<NavigationService>;
  let spyTranslateService: jasmine.SpyObj<TranslateService>;
  let spyMessageService: jasmine.SpyObj<MessageService>;
  let spyTitle: jasmine.SpyObj<Title>;

  describe('component init', () => {
    setUp();

    it('should create LoginContainerComponent', () => {
      expect(component).toBeTruthy();
    });

    it('should set title for login page', () => {
      expect(spyTitle.setTitle).toHaveBeenCalledOnceWith('login.title');
    });

    it('should logout user on init if he is logged in', () => {
      expect(spyUserService.logout).toHaveBeenCalledTimes(1);
    });
  });

  describe('on valid login form', () => {
    setUp();

    it('should call login service and navigate to cats page', () => {
      component['userNameControl'].setValue('abc');
      component['passwordControl'].setValue('abc');

      ngMocks.click(['testId', 'login-button']);

      expect(spyUserService.login).toHaveBeenCalledTimes(1);
      expect(spyNavigationService.navigateToCatsPage).toHaveBeenCalledTimes(1);
    });

    it('should handle invalid login or password error', () => {
      component['userNameControl'].setValue('abc');
      component['passwordControl'].setValue('abc');

      spyUserService.login.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: HttpStatusCode.Unauthorized }))
      );
      ngMocks.click(['testId', 'login-button']);

      expect(spyUserService.login).toHaveBeenCalledTimes(1);
      expect(spyMessageService.add).toHaveBeenCalledOnceWith({ severity: 'error', detail: 'errors.invalid-login' });
    });

    it('should handle connection error', () => {
      component['userNameControl'].setValue('abc');
      component['passwordControl'].setValue('abc');

      spyUserService.login.and.returnValue(
        throwError(() => new HttpErrorResponse({ status: HttpStatusCode.InternalServerError }))
      );
      ngMocks.click(['testId', 'login-button']);

      expect(spyUserService.login).toHaveBeenCalledTimes(1);
      expect(spyMessageService.add).toHaveBeenCalledOnceWith({ severity: 'error', detail: 'errors.load-data-failed' });
    });
  });

  describe('on invalid form', () => {
    setUp();

    it('should not call login service and navigate to cats page', () => {
      ngMocks.click(['testId', 'login-button']);

      expect(spyUserService.login).toHaveBeenCalledTimes(0);
    });
  });

  function setUp(): void {
    beforeEach(async () => {
      spyNavigationService = jasmine.createSpyObj('NavigationService', ['navigateToCatsPage']);
      spyTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
      spyMessageService = jasmine.createSpyObj('MessageService', ['add']);
      spyUserService = jasmine.createSpyObj('UserService', ['login', 'logout'], { isLoggedIn$: of(true) });
      spyTitle = jasmine.createSpyObj('Title', ['setTitle']);
      await MockBuilder(LoginContainerComponent)
        .mock(MessageService, spyMessageService)
        .mock(NavigationService, spyNavigationService)
        .mock(TranslateService, spyTranslateService)
        .mock(UserService, spyUserService)
        .mock(Title, spyTitle)
        .keep(LoginFormBuilderService);

      spyMessageService.add.calls.reset();
      spyTranslateService.instant.and.callFake((key: string) => key);
      spyNavigationService.navigateToCatsPage.and.returnValue(of(true) as never);
      spyUserService.login.and.returnValue(of(void 0));
      spyUserService.login.calls.reset();
      component = MockRender(LoginContainerComponent).point.componentInstance;
    });
  }
});
