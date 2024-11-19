import { createSelector, createFeatureSelector } from "@ngrx/store";
import { CalendarState } from './calendar.reducer';

//Setup for the Selectors of the ngrx/store library

/**
 * Create a feature selector that focusses on the partial application state "CalendarState"
 */
export const getCalendarState = createFeatureSelector<CalendarState>('calendar');

/**
 * Creates a selector for accessing the calendar event information in the CalendarState
 */
export const selectCalendarEvents = createSelector(
    getCalendarState,
    state => state.currentEvents
)

/**
 * Creates a selector for accessing the current language information in the CalendarState
 */
export const selectCurrentUserLanguage = createSelector(
    getCalendarState,
    state => state.currentUserLang
)

/**
 * Creates a selector for accessing the current loading state of in the CalendarState
 */
export const selectIsLoading = createSelector(
    getCalendarState,
    state => state.isLoading
)