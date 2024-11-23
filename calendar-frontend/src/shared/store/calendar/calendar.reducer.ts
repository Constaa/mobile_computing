import { createReducer, on, Action } from '@ngrx/store';
import { CalendarEvent } from '../../models/calendarEvent';
import * as CalendarActions from './calendar.actions';

//Setup for the Reducer of the ngrx/store library

//Definition of partial application state
export interface CalendarState {
    currentEvents: CalendarEvent[];
    currentUserLang: string;
    isLoading: boolean;
}

//Setup of initial state
export const initialState: CalendarState = {
    currentEvents: [],
    currentUserLang: "de",
    isLoading: false
}

export const _calendarReducer = createReducer(
    initialState,

    /**
     * On detecting a LoadCalendarEvents action, return a copied current state and set the isLoading variable.
     */
    on(CalendarActions.LoadCalendarEvents, state => {
        return { ...state, isLoading: true }
    }),

    /**
     * On detecting a ReceivedMessage action, set the current state to represent the action payload.
     */
    on(CalendarActions.ReceivedCalendarEvents, (state, { payload }) => {
        return { ...state, isLoading: false, currentEvents: payload }
    }),

    /**
     * On detecting a SetUserLanguage action, set the current language to represent the action payload.
     */
    on(CalendarActions.SetUserLanguage, (state, { language }) => {
        return { ...state, currentUserLang: language }
    }),
)

export function calendarReducer(state = initialState, action: Action) {
    return _calendarReducer(state, action);
}