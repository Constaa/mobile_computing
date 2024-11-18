import { createSelector, createFeatureSelector } from "@ngrx/store";
import { CalendarState } from './calendar.reducer';

export const getCalendarState = createFeatureSelector<CalendarState>('calendar');

export const selectCalendarEvents = createSelector(
    getCalendarState,
    state => state.currentEvents
)

export const selectCurrentUserLanguage = createSelector(
    getCalendarState,
    state => state.currentUserLang
)

export const selectIsLoading = createSelector(
    getCalendarState,
    state => state.isLoading
)