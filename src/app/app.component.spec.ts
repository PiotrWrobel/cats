import { MockBuilder, MockRender } from 'ng-mocks';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  let component: AppComponent;

  beforeEach(async (): Promise<void> => {
    await MockBuilder(AppComponent);
    component = MockRender(AppComponent).point.componentInstance;
  });

  describe('component init', () => {
    it('should create AppComponent', () => {
      expect(component).toBeTruthy();
    });
  });
});
