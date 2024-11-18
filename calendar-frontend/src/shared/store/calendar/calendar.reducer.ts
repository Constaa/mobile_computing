import { createReducer, on, Action } from '@ngrx/store';
import { CalendarEvent } from '../../models/calendarEvent';
import * as CalendarActions from './calendar.actions';

export interface CalendarState {
    currentEvents: CalendarEvent[];
    currentUserLang: string;
    isLoading: boolean;
}

export const initialState: CalendarState = {
    currentEvents: [],
    currentUserLang: "de",
    isLoading: false
}

export const _calendarReducer = createReducer(
    initialState,

    on(CalendarActions.LoadCalendarEvents, state => {
        return { ...state, isLoading: true }
    }),

    on(CalendarActions.ReceivedCalendarEvents, (state, { payload }) => {
        return { ...state, isLoading: false, currentEvents: payload }
    }),

    on(CalendarActions.SetUserLanguage, (state, { payload }) => {
        return { ...state, currentUserLang: payload }
    }),
)

export function calendarReducer(state = initialState, action: Action) {
    return _calendarReducer(state, action);
}