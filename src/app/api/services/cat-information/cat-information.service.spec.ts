import { HttpClientTestingModule, HttpTestingController, TestRequest } from '@angular/common/http/testing';
import { MockBuilder, ngMocks } from 'ng-mocks';
import { first } from 'rxjs';

import { CatInformationService } from './cat-information.service';

describe('CatInformationService', () => {
  let service: CatInformationService;
  let controller: HttpTestingController;

  beforeEach(async () => {
    return MockBuilder(CatInformationService)
      .keep(HttpClientTestingModule)
      .then(() => {
        controller = ngMocks.get(HttpTestingController);
        service = ngMocks.get(CatInformationService);
      });
  });

  describe('service init', () => {
    it('should be created', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('methods', () => {
    it('should get cats over http GET method', () => {
      const count: number = 3;

      service.getCatsData(count).pipe(first()).subscribe();

      const testRequest: TestRequest = controller.expectOne(`https://meowfacts.herokuapp.com/?count=${count}`);
      expect(testRequest.request.method).toBe('GET');
    });
  });
});
