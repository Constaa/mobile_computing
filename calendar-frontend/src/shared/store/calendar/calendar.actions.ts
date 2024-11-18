import { createAction, props } from '@ngrx/store';
import { CalendarEvent } from '../../models/calendarEvent';

export const LOAD_CALENDAR_EVENTS = '[Calendar] LoadCalendarEvents';
export const RECEIVED_CALENDAR_EVENTS = '[Calendar] ReceivedCalendarEvents';
export const SET_USER_LANGUAGE = '[Language] SetUserLanguage';
export const SET_USER_LANGUAGE_DONE = '[Language] SetUserLanguage';

export const LoadCalendarEvents = createAction(
    LOAD_CALENDAR_EVENTS
);

export const ReceivedCalendarEvents = createAction(
    RECEIVED_CALENDAR_EVENTS,
    props<{ payload: CalendarEvent[] }>()
);

export const SetUserLanguage = createAction(
    SET_USER_LANGUAGE,
    props<{ payload: string }>()
)

export const SetUserLanguageDone = createAction(
    SET_USER_LANGUAGE_DONE
)