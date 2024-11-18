import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects'
import { Observable } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';
import { CalendarEvent } from './../../models/calendarEvent'
import { CalendarService } from '../../services/calendar.service';
import * as CalendarActions from './calendar.actions'
import { Action } from '@ngrx/store';

@Injectable()
export class CalendarEffects {
    getCalendarEvents$: Observable<Action>;

    constructor(private action$: Actions, private calendarService: CalendarService) {
        this.getCalendarEvents$ = createEffect(() =>
            this.action$.pipe(ofType(CalendarActions.LoadCalendarEvents),
                mergeMap(action =>
                    this.calendarService.getCalendarEvents().pipe(map((data: CalendarEvent[]) => {
                        return CalendarActions.ReceivedCalendarEvents({ payload: data })
                    }))
                )));
    }
}