import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CalendarService } from '../../services/calendar.service';
import { CalendarEvent } from './../../models/calendarEvent';
import * as CalendarActions from './calendar.actions';

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
                    //Execute the specified service action to get the event data
                    this.calendarService.getCalendarEvents().pipe(map((data: CalendarEvent[]) => {
                        data.forEach(element => {
                            //Handle correct time conversions from UTC to local time zones.
                            if (element.startTime && element.startTime != "") {
                                //Create a temporary UTC Date object
                                let tempDate: Date = new Date(Date.UTC(0));
                                //Split the received time information into hours and minutes.
                                let timeInfo = element.startTime.split(':');
                                //Add the received hours and minutes to the temporary date.
                                tempDate.setHours(tempDate.getHours() + parseInt(timeInfo[0]));
                                tempDate.setMinutes(tempDate.getMinutes() + parseInt(timeInfo[1]));
                                //Convert the temporary Date to a time string that automatically uses the current time zone.
                                element.startTime = tempDate.toTimeString();
                            }

                            if (element.endTime && element.endTime != "") {
                                //Create a temporary UTC Date object
                                let tempDate: Date = new Date(Date.UTC(0));
                                //Split the received time information into hours and minutes.
                                let timeInfo = element.endTime.split(':');
                                //Add the received hours and minutes to the temporary date.
                                tempDate.setHours(tempDate.getHours() + parseInt(timeInfo[0]));
                                tempDate.setMinutes(tempDate.getMinutes() + parseInt(timeInfo[1]));
                                //Convert the temporary Date to a time string that automatically uses the current time zone.
                                element.endTime = tempDate.toTimeString();
                            }
                        });
                        //Return a store action that contains the received event data.
                        return CalendarActions.ReceivedCalendarEvents({ payload: data })
                    }))
                )));
    }
}