import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CalendarEvent } from './../../models/calendarEvent'
import { CalendarService } from '../../services/calendar.service';
import * as CalendarActions from './calendar.actions'
import { Action } from '@ngrx/store';

//Setup for the Effects of the ngrx/effects library

@Injectable()
export class CalendarEffects {
    getCalendarEvents$: Observable<Action>;

    constructor(private action$: Actions, private calendarService: CalendarService) {
        /**
         * ngrx effect that handles getting the calendar event data via the CalendarService.
         * After getting the calendar event information this effect triggers a ReceivedCalendarEvents action containing the event information.
         */
        this.getCalendarEvents$ = createEffect(() =>
            this.action$.pipe(ofType(CalendarActions.LoadCalendarEvents),
                mergeMap(action =>
                    this.calendarService.getCalendarEvents().pipe(map((data: CalendarEvent[]) => {
                        data.forEach(element => {
                            if (element.startTime && element.startTime != "") {
                                let tempDate: Date = new Date(Date.UTC(0));
                                let timeInfo = element.startTime.split(':');
                                tempDate.setHours(tempDate.getHours() + parseInt(timeInfo[0]));
                                tempDate.setMinutes(tempDate.getMinutes() + parseInt(timeInfo[1]));
                                element.startTime = tempDate.toTimeString();
                            }

                            if (element.endTime && element.endTime != "") {
                                let tempDate: Date = new Date(Date.UTC(0));
                                let timeInfo = element.endTime.split(':');
                                tempDate.setHours(tempDate.getHours() + parseInt(timeInfo[0]));
                                tempDate.setMinutes(tempDate.getMinutes() + parseInt(timeInfo[1]));
                                element.endTime = tempDate.toTimeString();
                            }
                        });
                        return CalendarActions.ReceivedCalendarEvents({ payload: data })
                    }))
                )));
    }
}