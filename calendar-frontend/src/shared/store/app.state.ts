import { CalendarState } from './calendar/calendar.reducer'

//Definition of application state
//Currently only one partial state is used. The used pattern allows for easy expansion.
export interface AppState {
    calendar: CalendarState
}