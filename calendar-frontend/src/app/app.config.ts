import { ApplicationConfig, importProvidersFrom, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore, StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { CalendarEffects } from '../shared/store/calendar/calendar.effects'
import { reducers } from '../shared/store';
import { provideHttpClient } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({ eventCoalescing: true }), provideRouter(routes), provideHttpClient(), provideAnimationsAsync(), importProvidersFrom(StoreModule.forRoot(reducers), EffectsModule.forRoot(CalendarEffects))]
};
