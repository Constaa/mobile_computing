/* import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import deLocale from '@fullcalendar/core/locales/de';
import enLocale from '@fullcalendar/core/locales/en-gb'
import { Observable } from 'rxjs';
import { CalendarEvent } from '../../shared/models/calendarEvent';
import { Store } from '@ngrx/store';
import * as CalendarActions from '../../shared/store/calendar/calendar.actions';
import * as CalendarSelectors from '../../shared/store/calendar/calendar.selectors';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-calendar',
  imports: [FullCalendarModule, MatSelectModule, FormsModule, TranslateModule, MatIconModule, MatInputModule, MatButtonModule],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss'
})
export class CalendarComponent implements OnInit {
  @ViewChild('calendar') calendarComponent!: FullCalendarComponent;

  calendarEvents$!: Observable<CalendarEvent[]>;
  calendarEvents: CalendarEvent[] = [];
  calendarLanguage$!: Observable<string>;
  calendarLanguage!: string;
  currentCategory: string = "all";
  searchQuery: string = '';

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

    //Messes with the display of events
    //TODO: figure out another way to fit all month onto a single page
    // multiMonthMaxColumns: 6,
    // multiMonthMinWidth: 200,
    // contentHeight: 650
  };

  constructor(private store: Store, private translate: TranslateService) { }

  /**
   * Internal Angular function that is called on component initialization.
   * Can be used to set up initial data by calling function directly on component startup.
   
  ngOnInit(): void {
    //TODO: Implement interval that continously gets the data from the backend

    //Select the state from the store and subscribe to receive updates when the data changes
    this.calendarEvents$ = this.store.select(CalendarSelectors.selectCalendarEvents);
    this.calendarEvents$.subscribe(x => {
      //Check if the reference to the calendar component is already initialized and assign the received event data.
      this.calendarEvents = x;
      if (this.calendarComponent) {
        this.calendarComponent.events = <EventInput>x;
      }
    });

    this.calendarLanguage$ = this.store.select(CalendarSelectors.selectCurrentUserLanguage);
    this.calendarLanguage$.subscribe(x => {
      this.calendarLanguage = x;
      this.setCalendarLanguage(x);
    })

    //Dispath the store action to load the data
    this.store.dispatch(CalendarActions.LoadCalendarEvents());
  }

  /**
   * Internal Angular function that is called after the component view has been initialized (as in the HTML DOM has been created).
   
  ngAfterViewInit() {
    //Assign the defined options to the calendar
    this.calendarComponent.options = this.calendarOptions;
    this.calendarComponent.options.eventClick = function (info) {
      let wholeDayDE: string;
      let wholeDayEN: string;

      if (!info.event.end) {
        wholeDayDE = "ganztägig";
        wholeDayEN = "entire day";
      } else {
        wholeDayDE = info.event.end?.toLocaleString();
        wholeDayEN = info.event.end?.toLocaleString();
      }

      //Hard-code translations as the http loader used in ngx-translate is not yet iitialized completly at this point.
      if (info.view.calendar.getOption('locale') == "de") {
        alert(`Titel: ${info.event.title}\r\nBeschreibung: ${info.event.extendedProps["description"]}\r\nStart: ${info.event.start?.toLocaleString()}\r\nEnde: ${wholeDayDE}\r\nKategorie: ${info.event.classNames}\r\nMindestteilnehmerzahl: ${info.event.extendedProps["minParticipants"]}\r\nMaximale Teilnehmer Anzahl: ${info.event.extendedProps["maxParticipants"]}`);
      } else {
        //Use generall 'else' statement instead if 'else if' to use english as a de facto default when the current locale is unexpected. 
        alert(`Title: ${info.event.title}\r\Description: ${info.event.extendedProps["description"]}\r\nStart: ${info.event.start?.toLocaleString()}\r\nEnd: ${wholeDayEN}\r\n Categorie: ${info.event.classNames}\r\nMin. Participants: ${info.event.extendedProps["minParticipants"]}\r\nMax. Participants: ${info.event.extendedProps["maxParticipants"]}`);
      }
    }
  }

  /**
   * Function for setting the current calendar language.
   * @param languageCode The language code to be set as the current language of the calendar.
   
  setCalendarLanguage(languageCode: string) {
    this.calendarOptions.locale = languageCode;
  }
  setCategory(event: MatSelectChange) {
    console.log(event.value)


    
  }
  applyFilters(): void {
    console.log('Aktuelle Filter:', {
      category: this.currentCategory,
      searchQuery: this.searchQuery,
    });
  }

}*/
