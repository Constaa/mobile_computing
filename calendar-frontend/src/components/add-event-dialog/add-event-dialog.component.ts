import { Component, inject, OnInit } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AdminComponent } from '../admin/admin.component';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DateAdapter, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarEvent } from '../../shared/models/calendarEvent';
import { CalendarService } from '../../shared/services/calendar.service';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatDividerModule } from '@angular/material/divider';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as CalendarSelectors from '../../shared/store/calendar/calendar.selectors';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';

@Component({
  selector: 'app-add-event-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, FormsModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatDividerModule, MatSelectModule, MatNativeDateModule, ReactiveFormsModule, TranslateModule, MatTimepickerModule, MatCheckboxModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss'
})
export class AddEventDialogComponent implements OnInit {
  private readonly _adapter = inject<DateAdapter<unknown, unknown>>(DateAdapter);
  readonly dialogRef = inject(MatDialogRef<AdminComponent>);

  calendarLanguage$!: Observable<string>;
  calendarLanguage!: string;
  newEvent: CalendarEvent = {
    id: 0,
    title: "",
    description: "",
    allDay: false,
    daysOfWeek: [],
    minParticipants: 0,
    maxParticipants: 0,
    className: ""
  };
  eventTitle: string = "";
  eventDescription: string = "";
  eventClassName: string = "";
  eventStartDate!: Date;
  eventEndDate!: Date;
  eventWholeDay: boolean = false;
  eventRecurring: boolean = false;
  eventDaysOfWeek: number[] = [];
  eventMinParticipants: number = 0;
  eventMaxParticipants: number = 0;

  constructor(private calendarService: CalendarService, private store: Store) { }

  /**
   * Diese Methode wird beim Initialisieren der Komponente aufgerufen.
   * Sie abonniert die aktuelle Sprache des Benutzers aus dem Store und setzt die Kalender-Sprache entsprechend.
   * 
   * - Abonniert `calendarLanguage$` aus dem Store, um die aktuelle Benutzersprache zu erhalten.
   * - Aktualisiert die lokale Variable `calendarLanguage` mit dem abonnierten Wert.
   * - Setzt das Locale des Adapters auf die ersten zwei Zeichen der Sprache, um die Anzeige von AM/PM im englischen Locale zu korrigieren.
   */
  ngOnInit(): void {
    this.calendarLanguage$ = this.store.select(CalendarSelectors.selectCurrentUserLanguage);
    this.calendarLanguage$.subscribe(x => {
      this.calendarLanguage = x;
      //Verwenden Sie nur die ersten beiden Zeichen als Locale, um die Anzeige von AM/PM im englischen Locale zu korrigieren
      this._adapter.setLocale(x.substring(0, 2));
    })
  }

  /**
   * Schließt den Dialog ohne Änderungen zu speichern.
   */
  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Setzt die wiederkehrenden Tage für ein Ereignis.
   *
   * @param event - Das MatSelectChange-Ereignis, das die ausgewählten Tage der Woche enthält.
   */
  setRecurringDays(event: MatSelectChange) {
    this.eventDaysOfWeek = event.value;
  }

  /**
   * Fügt ein neues Kalenderereignis hinzu.
   * 
   * Diese Methode sammelt die Informationen aus den entsprechenden Feldern
   * und erstellt ein neues Ereignisobjekt, das dann dem Kalenderdienst
   * hinzugefügt wird. Wenn das Ereignis wiederkehrend ist, werden auch die
   * Start- und Enddaten für die Wiederholung gesetzt.
   * 
   * Felder:
   * - title: Der Titel des Ereignisses.
   * - description: Die Beschreibung des Ereignisses.
   * - className: Die CSS-Klasse des Ereignisses.
   * - start: Das Startdatum des Ereignisses.
   * - end: Das Enddatum des Ereignisses.
   * - allDay: Gibt an, ob das Ereignis den ganzen Tag dauert.
   * - daysOfWeek: Die Wochentage, an denen das Ereignis stattfindet.
   * - minParticipants: Die minimale Anzahl von Teilnehmern.
   * - maxParticipants: Die maximale Anzahl von Teilnehmern.
   * - startRecur: Das Startdatum der Wiederholung (falls wiederkehrend).
   * - endRecur: Das Enddatum der Wiederholung (falls wiederkehrend).
   * 
   * Nach dem Hinzufügen des Ereignisses wird die Methode `cancel` aufgerufen,
   * um das Formular zurückzusetzen.
   */
  addCalendarEvent() {
    this.newEvent.title = this.eventTitle;
    this.newEvent.description = this.eventDescription;
    this.newEvent.className = this.eventClassName;
    this.newEvent.start = this.eventStartDate;
    this.newEvent.end = this.eventEndDate;
    this.newEvent.allDay = this.eventWholeDay;
    this.newEvent.daysOfWeek = this.eventDaysOfWeek;
    this.newEvent.minParticipants = this.eventMinParticipants;
    this.newEvent.maxParticipants = this.eventMaxParticipants;

    if (this.eventRecurring) {
      this.newEvent.startRecur = this.eventStartDate;
      this.newEvent.endRecur = this.eventEndDate;
      //startTime and endTime are handled in backend based on the times of these date objects
    }

    console.log(this.newEvent);
    this.calendarService.addCalendarEvent(this.newEvent);

    this.cancel();
  }

  /**
   * Diese Methode entfernt den Fokus vom aktuell aktiven Element.
   * Sie ruft die `blur`-Methode auf dem aktuell fokussierten HTML-Element auf.
   */
  blur() {
    let active = document.activeElement as HTMLElement;
    active.blur();
  }
}
