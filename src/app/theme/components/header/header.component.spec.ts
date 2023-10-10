import { HttpErrorResponse } from '@angular/common/http';
import { MockBuilder, MockRender, ngMocks } from 'ng-mocks';
import { of, throwError } from 'rxjs';

import { UserService } from '../../../api/services/user/user.service';
import { NavigationService } from '../../../core/services/navigation/navigation.service';
import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let spyUserService: jasmine.SpyObj<UserService>;
  let spyNavigationService: jasmine.SpyObj<NavigationService>;

  describe('component init', () => {
    setUp();

    it('should create HeaderComponent', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('on user logged in', () => {
    setUp(true);

    beforeEach(() => {
      spyNavigationService.navigateToLoginPage.calls.reset();
      spyUserService.logout.calls.reset();
    });

    it('should handle error and navigate to login screen', () => {
      spyUserService.logout.and.returnValue(throwError(() => new HttpErrorResponse({})));
      ngMocks.click(['testId', 'logout-button']);

      expect(spyUserService.logout).toHaveBeenCalledTimes(1);
      expect(spyNavigationService.navigateToLoginPage).toHaveBeenCalledTimes(1);
    });

    it('should logout user and redirect to login', () => {
      spyUserService.logout.and.returnValue(of(void 0));
      ngMocks.click(['testId', 'logout-button']);

      expect(spyUserService.logout).toHaveBeenCalledTimes(1);
      expect(spyNavigationService.navigateToLoginPage).toHaveBeenCalledTimes(1);
    });
  });

  function setUp(isUserLoggedIn: boolean = false): void {
    spyUserService = jasmine.createSpyObj('UserService', ['logout'], { isLoggedIn$: of(isUserLoggedIn) });
    spyNavigationService = jasmine.createSpyObj('NavigationService', ['navigateToLoginPage']);

    beforeEach(async (): Promise<void> => {
      await MockBuilder(HeaderComponent)
        .mock(UserService, spyUserService)
        .mock(NavigationService, spyNavigationService);
      spyNavigationService.navigateToLoginPage.and.returnValue(Promise.resolve(true));

      component = MockRender(HeaderComponent).point.componentInstance;
    });
  }
});
