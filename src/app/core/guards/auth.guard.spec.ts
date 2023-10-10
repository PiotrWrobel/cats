import { TestBed } from '@angular/core/testing';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot, UrlTree } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { MockBuilder, MockService } from 'ng-mocks';
import { first, Observable, of } from 'rxjs';

import { UserService } from '../../api/services/user/user.service';
import { authGuard } from './auth.guard';

describe('authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));

  describe('guard init', () => {
    setUp();

    it('should be created', () => {
      expect(executeGuard).toBeTruthy();
    });
  });

  describe('on user Logged in', () => {
    setUp(true);

    it('should allow navigation', () => {
      const guard: Observable<boolean> = executeGuard(
        MockService(ActivatedRouteSnapshot),
        MockService(RouterStateSnapshot)
      ) as Observable<boolean>;

      guard.pipe(first()).subscribe((value: boolean) => expect(value).toBeTrue());
    });
  });

  describe('on user not logged in', () => {
    setUp();

    it('should not allow navigation and redirect to Login', () => {
      const guard: Observable<UrlTree> = executeGuard(
        MockService(ActivatedRouteSnapshot),
        MockService(RouterStateSnapshot)
      ) as Observable<UrlTree>;

      guard.pipe(first()).subscribe((value: UrlTree) => expect(value).toBeInstanceOf(UrlTree));
    });
  });

  function setUp(isUserLoggedIn: boolean = false): void {
    beforeEach(() => {
      return MockBuilder()
        .mock(UserService, { isLoggedIn$: of(isUserLoggedIn) })
        .keep(RouterTestingModule);
    });
  }
});
