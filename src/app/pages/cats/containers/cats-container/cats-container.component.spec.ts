import { HttpErrorResponse } from '@angular/common/http';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { MockBuilder, MockRender } from 'ng-mocks';
import { MessageService } from 'primeng/api';
import { of, throwError } from 'rxjs';

import { CatInformationService } from '../../../../api/services/cat-information/cat-information.service';
import { CatsContainerComponent } from './cats-container.component';

describe('CatsContainerComponent', () => {
  let component: CatsContainerComponent;
  let spyTitle: jasmine.SpyObj<Title>;
  let spyTranslateService: jasmine.SpyObj<TranslateService>;
  let spyCatInformationService: jasmine.SpyObj<CatInformationService>;
  let spyMessageService: jasmine.SpyObj<MessageService>;

  const loadCount: number = 10;

  beforeEach(async (): Promise<void> => {
    spyTitle = jasmine.createSpyObj('Title', ['setTitle']);
    spyTranslateService = jasmine.createSpyObj('TranslateService', ['instant']);
    spyCatInformationService = jasmine.createSpyObj('CatInformationService', ['getCatsData']);
    spyMessageService = jasmine.createSpyObj('MessageService', ['add']);

    return MockBuilder(CatsContainerComponent)
      .mock(CatInformationService, spyCatInformationService)
      .mock(TranslateService, spyTranslateService)
      .mock(MessageService, spyMessageService)
      .mock(Title, spyTitle)
      .then(() => {
        spyTranslateService.instant.and.callFake((key: string) => key);
        spyCatInformationService.getCatsData.and.returnValue(of({ data: ['cat info'] }));

        component = MockRender(CatsContainerComponent).point.componentInstance;
      });
  });

  describe('component init', () => {
    it('should create CatsContainerComponent', () => {
      expect(component).toBeTruthy();
    });

    it('should set page title', () => {
      expect(spyTitle.setTitle).toHaveBeenCalledOnceWith('cats.title');
    });

    it('should get cats on init', () => {
      expect(spyCatInformationService.getCatsData).toHaveBeenCalledOnceWith(loadCount);
    });
  });

  describe('load data ond demand', () => {
    it('should load data on demand', () => {
      spyCatInformationService.getCatsData.calls.reset();
      component['onScrolled']();
      expect(spyCatInformationService.getCatsData).toHaveBeenCalledOnceWith(loadCount);
    });

    it('should handle error on loading data', () => {
      spyCatInformationService.getCatsData.calls.reset();
      spyCatInformationService.getCatsData.and.returnValue(throwError(() => new HttpErrorResponse({})));
      component['onScrolled']();

      expect(spyMessageService.add).toHaveBeenCalledOnceWith({ severity: 'error', detail: 'errors.load-data-failed' });
    });
  });
});
