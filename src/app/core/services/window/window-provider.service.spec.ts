import { MockBuilder, ngMocks } from 'ng-mocks';

import { WindowProviderService } from './window-provider.service';

describe('WindowProviderService', () => {
  let service: WindowProviderService;

  beforeEach(async () => {
    await MockBuilder(WindowProviderService);
    service = ngMocks.get(WindowProviderService);
  });

  describe('service init', () => {
    it('should create WindowProviderService', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('provide window', () => {
    it('should provide window object', () => {
      expect(service.window).toBeInstanceOf(Window);
    });
  });
});
