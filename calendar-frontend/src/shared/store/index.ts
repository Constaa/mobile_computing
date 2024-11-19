import { calendarReducer } from './calendar/calendar.reducer'

//Definition of all application reducers
//Currently only one reducer is used. The used pattern allows for easy expansion.
export const reducers = {
    calendar: calendarReducer
}