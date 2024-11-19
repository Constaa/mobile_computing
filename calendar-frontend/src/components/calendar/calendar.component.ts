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

  /**
   * Internal Angular function that is called on component initialization.
   * Can be used to set up initial data by calling function directly on component startup.
   */
  ngOnInit(): void {
    this.calendarEvents$ = this.store.select(CalendarSelectors.selectCalendarEvents);
    this.calendarEvents$.subscribe(x => {
      //Check if the reference to the calendar component is already initialized and assign the received event data.
      if (this.calendarComponent) {
        this.calendarComponent.events = <EventInput>x;
      }
    });

    this.store.dispatch(CalendarActions.LoadCalendarEvents());
  }

  /**
   * Internal Angular function that is called after the component view has been initialized (as in the HTML DOM has been created).
   */
  ngAfterViewInit() {
    //Assign the defined options to the calendar
    this.calendarComponent.options = this.calendarOptions;
  }

  /**
   * Function for setting the current calendar language.
   * @param languageCode The language code to be set as the current language of the calendar.
   */
  setCalendarLanguage(languageCode: string) {
    this.calendarOptions.locale = languageCode;
  }
}
