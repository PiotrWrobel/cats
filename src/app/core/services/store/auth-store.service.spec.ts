import { MockBuilder, ngMocks } from 'ng-mocks';

import { WindowProviderService } from '../window/window-provider.service';
import { AuthStoreService } from './auth-store.service';

describe('AuthStoreService', () => {
  let service: AuthStoreService;
  let spyLocalStorage: jasmine.SpyObj<Storage>;

  const tokenKey: string = 'tokenKey';
  const token: string = 'abc';

  beforeEach(async (): Promise<void> => {
    spyLocalStorage = jasmine.createSpyObj('Storage', ['setItem', 'getItem', 'removeItem']);

    await MockBuilder(AuthStoreService).mock(WindowProviderService, {
      window: { localStorage: spyLocalStorage } as never
    });
    service = ngMocks.get(AuthStoreService);
  });

  describe('service init', () => {
    it('should create StoreService', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('store authentication token', () => {
    it('should store auth token in localStorage', () => {
      service.storeToken(token);

      expect(spyLocalStorage.setItem).toHaveBeenCalledOnceWith(tokenKey, token);
    });

    it('should get token from localStorage', () => {
      spyLocalStorage.getItem.and.returnValue(token);

      expect(service.getToken()).toBe(token);
      expect(spyLocalStorage.getItem).toHaveBeenCalledTimes(1);
    });

    it('should cleat token from storage', () => {
      service.clearToken();
      expect(spyLocalStorage.removeItem).toHaveBeenCalledOnceWith(tokenKey);
    });
  });
});
