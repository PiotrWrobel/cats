import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { AuthInterceptor } from '~core/interceptors/auth/auth.interceptor';
import { RefreshTokenInterceptor } from '~core/interceptors/refresh-token/refresh-token.interceptor';

import { routes } from './app.routes';

const DEFAULT_LANGUAGE: string = 'pl';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    importProvidersFrom([
      BrowserAnimationsModule,
      HttpClientModule,
      TranslateModule.forRoot({
        defaultLanguage: DEFAULT_LANGUAGE,
        loader: {
          provide: TranslateLoader,
          useFactory: translateLoaderFactory,
          deps: [HttpClient]
        }
      })
    ]),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: RefreshTokenInterceptor, multi: true }
  ]
};

function translateLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
