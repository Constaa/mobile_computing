import { Component, OnInit, ViewChild } from '@angular/core';
import { FullCalendarComponent, FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, EventInput } from '@fullcalendar/core/index.js';
import dayGridPlugin from '@fullcalendar/daygrid';
import listPlugin from '@fullcalendar/list';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import deLocale from '@fullcalendar/core/locales/de';
import enLocale from '@fullcalendar/core/locales/en-gb';
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
  filteredEvents: CalendarEvent[] = [];
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
  };

  constructor(private store: Store, private translate: TranslateService) { }

  ngOnInit(): void {
    this.calendarEvents$ = this.store.select(CalendarSelectors.selectCalendarEvents);
    this.calendarEvents$.subscribe(x => {
      this.calendarEvents = x;
      this.applyFilters(); // Apply initial filter
    });

    this.calendarLanguage$ = this.store.select(CalendarSelectors.selectCurrentUserLanguage);
    this.calendarLanguage$.subscribe(x => {
      this.calendarLanguage = x;
      this.setCalendarLanguage(x);
    })

    this.store.dispatch(CalendarActions.LoadCalendarEvents());
  }

  /**
   * Diese Methode wird nach der Initialisierung der Ansicht aufgerufen.
   * Sie setzt die Optionen des Kalender-Components und definiert eine Funktion,
   * die beim Klicken auf ein Ereignis im Kalender ausgeführt wird.
   * 
   * Die Funktion zeigt ein Alert-Fenster mit den Details des angeklickten Ereignisses an.
   * Die angezeigten Informationen variieren je nach eingestellter Sprache (Deutsch oder Englisch).
   * 
   * @method ngAfterViewInit
   */
  ngAfterViewInit() {
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

      if (info.view.calendar.getOption('locale') == "de") {
        alert(`Titel: ${info.event.title}\r\nBeschreibung: ${info.event.extendedProps["description"]}\r\nStart: ${info.event.start?.toLocaleString()}\r\nEnde: ${wholeDayDE}\r\nKategorie: ${info.event.classNames.join(', ')}\r\nMindestteilnehmerzahl: ${info.event.extendedProps["minParticipants"]}\r\nMaximale Teilnehmer Anzahl: ${info.event.extendedProps["maxParticipants"]}`);
      } else {
        alert(`Title: ${info.event.title}\r\nDescription: ${info.event.extendedProps["description"]}\r\nStart: ${info.event.start?.toLocaleString()}\r\nEnd: ${wholeDayEN}\r\nCategory: ${info.event.classNames.join(', ')}\r\nMin. Participants: ${info.event.extendedProps["minParticipants"]}\r\nMax. Participants: ${info.event.extendedProps["maxParticipants"]}`);
      }
    }
  }

  /**
   * Setzt die Sprache des Kalenders.
   *
   * @param languageCode - Der Sprachcode, der für den Kalender verwendet werden soll.
   */
  setCalendarLanguage(languageCode: string) {
    this.calendarOptions.locale = languageCode;
  }

  
  /**
   * Setzt die aktuelle Kategorie basierend auf der Auswahl des Benutzers und wendet die Filter an.
   *
   * @param event - Das Auswahlereignis von MatSelect, das die neue Kategorie enthält.
   */
  setCategory(event: MatSelectChange) {
    this.currentCategory = event.value;
    this.applyFilters();
  }


  /**
 * Wendet Filter auf die Kalenderereignisse basierend auf der aktuellen Kategorie und Suchanfrage an.
 * 
 * - Filtert Ereignisse nach Kategorie, wenn die aktuelle Kategorie nicht 'all' ist.
 * - Filtert Ereignisse nach Suchanfrage, wenn die Suchanfrage nicht leer ist.
 * - Aktualisiert die Kalenderkomponente mit den gefilterten Ereignissen.
 * - Protokolliert die aktuellen Filtereinstellungen in der Konsole.
 */
  applyFilters(): void {
    this.filteredEvents = this.calendarEvents;

    if (this.currentCategory !== 'all') {
      this.filteredEvents = this.filteredEvents.filter(event => event.className && event.className.includes(this.currentCategory));
    }

    if (this.searchQuery.trim() !== '') {
      this.filteredEvents = this.filteredEvents.filter(event => event.title.toLowerCase().includes(this.searchQuery.toLowerCase()));
    }

    if (this.calendarComponent) {
      this.calendarComponent.events = <EventInput>this.filteredEvents;
    }

    console.log('Aktuelle Filter:', {
      category: this.currentCategory,
      searchQuery: this.searchQuery,
    });
  }
}
