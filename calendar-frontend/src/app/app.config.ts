import { ApplicationConfig, importProvidersFrom, isDevMode, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { TranslateLoader, TranslateModule } from "@ngx-translate/core";
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { reducers } from '../shared/store';
import { CalendarEffects } from '../shared/store/calendar/calendar.effects';
import { routes } from './app.routes';
import { ErrorInterceptor } from './error-interceptor';

const httpLoaderFactory: (http: HttpClient) => TranslateHttpLoader = (http: HttpClient) =>
  new TranslateHttpLoader(http, './i18n/', '.json');

export const appConfig: ApplicationConfig = {
  //Import all needed functionalities.
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(withInterceptors([ErrorInterceptor])), provideAnimationsAsync(), importProvidersFrom(StoreModule.forRoot(reducers), EffectsModule.forRoot(CalendarEffects), [TranslateModule.forRoot({
    loader: {
      provide: TranslateLoader,
      useFactory: httpLoaderFactory,
      deps: [HttpClient],
    },
  })]), provideStoreDevtools({ maxAge: 25, logOnly: !isDevMode() })]
};
