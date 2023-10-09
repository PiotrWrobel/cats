import { MockBuilder, MockRender } from 'ng-mocks';

import { HeaderComponent } from './header.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;

  beforeEach(async (): Promise<void> => {
    await MockBuilder(HeaderComponent);
    component = MockRender(HeaderComponent);
  });

  describe('component init', () => {
    it('should create HeaderComponent', () => {
      expect(component).toBeTruthy();
    });
  });
});
