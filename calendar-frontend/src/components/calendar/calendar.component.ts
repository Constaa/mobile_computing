import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import deLocale from '@fullcalendar/core/locales/de';
import enLocale from '@fullcalendar/core/locales/en-gb'
import { Observable } from 'rxjs';
import { CalendarEvent } from '../../shared/models/calendarEvent';
import { Store } from '@ngrx/store';
import * as CalendarActions from '../../shared/store/calendar/calendar.actions';
import * as CalendarSelectors from '../../shared/store/calendar/calendar.selectors';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarEvents$!: Observable<CalendarEvent[]>;
  calendarEvents: CalendarEvent[] = [];

  calendarOptions: CalendarOptions = {
    initialView: 'multiMonthYear',
    plugins: [dayGridPlugin, multiMonthPlugin],
    locales: [deLocale, enLocale],
    locale: 'de',

    //Messes with the display of events
    //TODO: figure out another way to fit all month onto a single page
    // multiMonthMaxColumns: 6,
    // multiMonthMinWidth: 200,
    // contentHeight: 650
  };

  constructor(private store: Store) { }

  ngOnInit(): void {
    this.calendarEvents$ = this.store.select(CalendarSelectors.selectCalendarEvents);
    this.calendarEvents$.subscribe(x => {
      //this.calendarEvents = x;
      try {
        this.calendarComponent.events = <EventInput>x;
      } catch (ex) {
        console.log(ex);
      }
    })
    this.store.dispatch(CalendarActions.LoadCalendarEvents());
  }

  ngAfterViewInit() {
    this.calendarComponent.options = this.calendarOptions;
  }

  setCalendarLanguage(languageCode: string) {
    this.calendarOptions.locale = languageCode;
  }
}
