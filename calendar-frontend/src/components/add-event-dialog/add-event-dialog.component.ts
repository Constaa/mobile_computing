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
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { MatCheckboxModule } from '@angular/material/checkbox';
import * as CalendarSelectors from '../../shared/store/calendar/calendar.selectors';

@Component({
  selector: 'app-add-event-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, FormsModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, TranslateModule, MatTimepickerModule, MatCheckboxModule],
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
  eventStartDate!: Date;
  eventEndDate!: Date;
  eventWholeDay: boolean = false;

  constructor(private calendarService: CalendarService, private store: Store) { }

  ngOnInit(): void {
    this.calendarLanguage$ = this.store.select(CalendarSelectors.selectCurrentUserLanguage);
    this.calendarLanguage$.subscribe(x => {
      this.calendarLanguage = x;
      //Use the first two characters as locale only, to fix the display of AM / PM in english locale
      this._adapter.setLocale(x.substring(0, 2));
    })
  }

  /**
   * Function for closing the dialog window.
   */
  cancel(): void {
    this.dialogRef.close();
  }

  addCalendarEvent() {
    this.newEvent.title = this.eventTitle;
    this.newEvent.description = this.eventDescription;
    this.newEvent.start = this.eventStartDate;
    this.newEvent.end = this.eventEndDate;
    this.newEvent.allDay = this.eventWholeDay;

    console.log(this.newEvent);
    this.calendarService.addCalendarEvent(this.newEvent);

    this.cancel();
  }

  blur() {
    let active = document.activeElement as HTMLElement;
    active.blur();
  }
}
