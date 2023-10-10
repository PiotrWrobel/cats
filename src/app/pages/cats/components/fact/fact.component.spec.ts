import { MockBuilder, MockRender } from 'ng-mocks';

import { FactComponent } from './fact.component';

describe('FactComponent', () => {
  let component: FactComponent;

  beforeEach(async () => {
    await MockBuilder(FactComponent);
    component = MockRender(FactComponent).point.componentInstance;
  });

  describe('component init', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
