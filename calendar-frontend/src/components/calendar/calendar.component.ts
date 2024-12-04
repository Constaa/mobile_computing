import { Component, OnInit, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core/index.js';
import deLocale from '@fullcalendar/core/locales/de';
import enLocale from '@fullcalendar/core/locales/en-gb';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import multiMonthPlugin from '@fullcalendar/multimonth';
import timeGridPlugin from '@fullcalendar/timegrid';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { debounceTime, fromEvent, map, Observable, startWith } from 'rxjs';
import { CalendarEvent } from '../../shared/models/calendarEvent';
import * as CalendarActions from '../../shared/store/calendar/calendar.actions';
import * as CalendarSelectors from '../../shared/store/calendar/calendar.selectors';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, MatSelectModule, FormsModule, TranslateModule, MatIconModule, MatInputModule, MatButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  //Set a reference to the calendar component in the HTML template.
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarEvents$!: Observable<CalendarEvent[]>;
  calendarEvents: CalendarEvent[] = [];
  filteredEvents: CalendarEvent[] = [];
  calendarLanguage$!: Observable<string>;
  calendarLanguage!: string;
  currentCategory: string = "all";
  searchQuery: string = '';
  isScreenSizeSmall$!: Observable<boolean>;
  isScreenSizeSmall: boolean = false;
  headerToolbar!: HTMLDivElement;

  //Set the default calendar configuration
  calendarOptions: CalendarOptions = {
    initialView: 'multiMonthYear',
    plugins: [dayGridPlugin, multiMonthPlugin, timeGridPlugin, listPlugin],
    locales: [deLocale, enLocale],
    locale: 'de',
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,multiMonthYear,timeGridWeek,timeGridDay,listWeek'
    },
    contentHeight: "670px"
  };

  constructor(private store: Store) { }

  /**
   * Internal Angular function that is called once when the component is being accessed.
   */
  ngOnInit(): void {
    //Set references to the store for getting the event data that is received from the backend and saved in the store
    this.calendarEvents$ = this.store.select(CalendarSelectors.selectCalendarEvents);
    this.calendarEvents$.subscribe(x => {
      this.calendarEvents = x;
      this.applyFilters(); // Apply initial filter
    });

    //Handle language changes by subscribing to changes in the corresponding store sections.
    this.calendarLanguage$ = this.store.select(CalendarSelectors.selectCurrentUserLanguage);
    this.calendarLanguage$.subscribe(x => {
      this.calendarLanguage = x;
      this.setCalendarLanguage(x);
    })

    //Dispatch a store action to initially load the calendar events.
    this.store.dispatch(CalendarActions.LoadCalendarEvents());
  }

  /**
   * Internal Angular function that is calles once the site view (HTML DOM) has been constructed.
   */
  ngAfterViewInit() {
    //Set the calendar options on the calendar reference after the HTML DOM has been initialized
    this.calendarComponent.options = this.calendarOptions;
    //Add the click event handler for events which is used for displaying a information popup when clicking on an event.
    this.calendarComponent.options.eventClick = function (info) {
      let wholeDayDE: string;
      let wholeDayEN: string;

      if (!info.event.end) {
        //Set this translation information manually as the translation service is not yet initialized at this application state.
        wholeDayDE = "ganztägig";
        wholeDayEN = "entire day";
      } else {
        wholeDayDE = info.event.end?.toLocaleString();
        wholeDayEN = info.event.end?.toLocaleString();
      }

      //Set this translation information manually as the translation service is not yet initialized at this application state.
      if (info.view.calendar.getOption('locale') == "de") {
        alert(`Titel: ${info.event.title}\r\nBeschreibung: ${info.event.extendedProps["description"]}\r\nStart: ${info.event.start?.toLocaleString()}\r\nEnde: ${wholeDayDE}\r\nKategorie: ${info.event.classNames.join(', ')}\r\nMindestteilnehmerzahl: ${info.event.extendedProps["minParticipants"]}\r\nMaximale Teilnehmer Anzahl: ${info.event.extendedProps["maxParticipants"]}`);
      } else {
        alert(`Title: ${info.event.title}\r\nDescription: ${info.event.extendedProps["description"]}\r\nStart: ${info.event.start?.toLocaleString()}\r\nEnd: ${wholeDayEN}\r\nCategory: ${info.event.classNames.join(', ')}\r\nMin. Participants: ${info.event.extendedProps["minParticipants"]}\r\nMax. Participants: ${info.event.extendedProps["maxParticipants"]}`);
      }
    }

    //Get a reference to the calendar tool bar that contains different calendar controls.
    this.headerToolbar = document.getElementsByClassName("fc-header-toolbar")[0] as HTMLDivElement;

    //Setup event listener for detecting changes in screen size.
    const checkScreenSize = () => document.body.offsetWidth < 1281;
    const screenSizeChanged$ = fromEvent(window, 'resize').pipe(debounceTime(500), map(checkScreenSize));
    this.isScreenSizeSmall$ = screenSizeChanged$.pipe(startWith(checkScreenSize()));
    this.isScreenSizeSmall$.subscribe(x => {
      //Change different calendar options depending if the screen is detected as small or not.
      this.isScreenSizeSmall = x;
      if (this.isScreenSizeSmall) {
        this.calendarOptions.contentHeight = "520px";
        console.log(this.headerToolbar);
        if (this.headerToolbar) {
          this.headerToolbar.classList.add("small-screen-toolbar");
        }
      } else {
        this.calendarOptions.contentHeight = "670px";
        if (this.headerToolbar) {
          this.headerToolbar.classList.remove("small-screen-toolbar");
        }
      }
    });
  }

  /**
   * Function for setting the current language used in the calendar display.
   * @param languageCode The language code that should be set.
   */
  setCalendarLanguage(languageCode: string) {
    //Set the calendar locale option to handle calendar translation
    this.calendarOptions.locale = languageCode;
  }

  /**
   * Function for setting the filter category.
   *
   * @param event - MatSelectChange event that is sent when the selection of the control changes.
   */
  setCategory(event: MatSelectChange) {
    this.currentCategory = event.value;
    this.applyFilters();
  }

  /**
   * Function for applying filters to the currently displayed events.
   */
  applyFilters(): void {
    this.filteredEvents = this.calendarEvents;

    //Handles filters based on the category select control.
    if (this.currentCategory !== 'all') {
      this.filteredEvents = this.filteredEvents.filter(event => event.className && event.className.includes(this.currentCategory));
    }

    //Handles filters based on the entered search string.
    if (this.searchQuery.trim() !== '') {
      this.filteredEvents = this.filteredEvents.filter(event => event.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }

    if (this.calendarComponent) {
      //Assing the filtered event to be displayed by the calendar component.
      this.calendarComponent.events = <EventInput>this.filteredEvents;
    }
  }
}
