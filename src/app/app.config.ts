import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { routes } from './app.routes';

const DEFAULT_LANGUAGE: string = 'pl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom([
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: DEFAULT_LANGUAGE,
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoaderFactory,
          deps: [HttpClient]
        }
      })
    ])
  ]
};

function translateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
