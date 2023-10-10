import { Router } from '@angular/router';
import { MockBuilder, ngMocks } from 'ng-mocks';

import { NavigationService } from './navigation.service';
import { RoutePath } from './path/route-path';

describe('NavigationService', () => {
  let service: NavigationService;
  let spyRouter: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    spyRouter = jasmine.createSpyObj('Router', ['navigate']);

    await MockBuilder(NavigationService).mock(Router, spyRouter);
    service = ngMocks.get(NavigationService);
  });

  describe('service init', () => {
    it('should create NavigationService', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('methods', () => {
    it('should navigate to cats', () => {
      service.navigateToCatsPage();
      expect(spyRouter.navigate).toHaveBeenCalledOnceWith([RoutePath.CATS]);
    });
  });
});
