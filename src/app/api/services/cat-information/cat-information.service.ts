import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiUrls } from '~api/api-urls';

import { GetCatsDataResponse } from './model/get-cats-data-response';

@Injectable()
export class CatInformationService {
  private readonly http: HttpClient = inject(HttpClient);

  public getCatsData(count: number): Observable<GetCatsDataResponse> {
    return this.http.get<GetCatsDataResponse>(ApiUrls.catInformationUrl, { params: { count } });
  }
}
