import { createAction, props } from '@ngrx/store';
import { CalendarEvent } from '../../models/calendarEvent';

//Setup for the Actions of the ngrx/store library

//Set the Action messages visible in the store devtools.
export const LOAD_CALENDAR_EVENTS = '[Calendar] LoadCalendarEvents';
export const RECEIVED_CALENDAR_EVENTS = '[Calendar] ReceivedCalendarEvents';
export const SET_USER_LANGUAGE = '[Language] SetUserLanguage';
export const SET_USER_LANGUAGE_DONE = '[Language] SetUserLanguage';

//Create the action for loading the calendar events
export const LoadCalendarEvents = createAction(
    LOAD_CALENDAR_EVENTS
);

//Create the action for received calendar events
export const ReceivedCalendarEvents = createAction(
    RECEIVED_CALENDAR_EVENTS,
    props<{ payload: CalendarEvent[] }>()
);

//Create the action for setting the currently used language
export const SetUserLanguage = createAction(
    SET_USER_LANGUAGE,
    props<{ payload: string }>()
)

//Create the action for succesfully set used language
export const SetUserLanguageDone = createAction(
    SET_USER_LANGUAGE_DONE
)