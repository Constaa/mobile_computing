import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { DateAdapter, MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { Store } from '@ngrx/store';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CalendarEvent } from '../../shared/models/calendarEvent';
import { CalendarService } from '../../shared/services/calendar.service';
import * as CalendarSelectors from '../../shared/store/calendar/calendar.selectors';
import { AdminComponent } from '../admin/admin.component';

@Component({
  selector: 'app-add-event-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, FormsModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatDividerModule, MatSelectModule, MatNativeDateModule, ReactiveFormsModule, TranslateModule, MatTimepickerModule, MatCheckboxModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss'
})
export class AddEventDialogComponent implements OnInit {
  //Setup needed variables
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
  formValid: boolean = false;
  intervalId: any;
  currentValidationError: string = "";

  constructor(private calendarService: CalendarService, private store: Store, private translate: TranslateService) { }

  /**
   * Internal Angular function that is called once when the component is being accessed.
   */
  ngOnInit(): void {
    this.calendarLanguage$ = this.store.select(CalendarSelectors.selectCurrentUserLanguage);
    this.calendarLanguage$.subscribe(x => {
      this.calendarLanguage = x;
      //Use only the first to characters to correctly set the locale for the date and time pickers and handle AM/PM in corresponding locales.
      this._adapter.setLocale(x.substring(0, 2));
    });

    /** 
     * Create an interval that will periodically execute the enclosed functions.
     * Used to periodically check the validity of the entered data.
     */
    this.intervalId = setInterval(() => {
      this.checkInputValidity();
    }, 500);
  }

  /**
   * Internal Angular function that is called on component destruction.
   * Here the set interval is cleared.
   */
  ngOnDestroy() {
    clearInterval(this.intervalId);
  }

  /**
   * Function for closing the dialog without saving the event to the database.
   */
  cancel(): void {
    this.dialogRef.close();
  }

  /**
   * Function for setting the recurring days of a recurring event.
   *
   * @param event - MatSelectChange event that is sent when the selection of the control changes.
   */
  setRecurringDays(event: MatSelectChange) {
    this.eventDaysOfWeek = event.value;
  }

  /**
   * Function for adding a new event to the database.
   */
  addCalendarEvent() {
    //Set the values of the new event
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

    //Send the data to the backend via the corresponding function in the service.
    this.calendarService.addCalendarEvent(this.newEvent);

    //Close the dialog.
    this.cancel();
  }

  /**
   * Function for checking the validity of the different event input options.
   * @returns void
   */
  checkInputValidity() {
    if (!this.eventTitle || this.eventTitle == "") {
      this.formValid = false;
      this.currentValidationError = this.translate.instant('add-event-dialog.titleValidation');
      return;
    }

    if (!this.eventDescription || this.eventDescription == "") {
      this.formValid = false;
      this.currentValidationError = this.translate.instant('add-event-dialog.descriptionValidation');
      return;
    }

    if (!this.eventClassName || this.eventClassName == "") {
      this.formValid = false;
      this.currentValidationError = this.translate.instant('add-event-dialog.classNameValidation');
      return;
    }

    //Parsing to string and then back to int is needed to get the correct result
    if (parseInt(this.eventMinParticipants.toString()) > parseInt(this.eventMaxParticipants.toString())) {
      this.formValid = false;
      this.currentValidationError = this.translate.instant('add-event-dialog.participantValidation');
      return;
    }

    if (this.eventMinParticipants < 0 || this.eventMaxParticipants < 0) {
      this.formValid = false;
      this.currentValidationError = this.translate.instant('add-event-dialog.negativeParticipantsValidation');
      return;
    }


    if (this.eventRecurring && this.eventDaysOfWeek.length == 0) {
      this.formValid = false;
      this.currentValidationError = this.translate.instant('add-event-dialog.recurringValidation');
      return;
    }

    if (!this.eventStartDate || !this.eventEndDate) {
      this.formValid = false;
      this.currentValidationError = this.translate.instant('add-event-dialog.dateValidation');
      return;
    }

    if (!this.eventWholeDay && this.eventStartDate > this.eventEndDate) {
      this.formValid = false;
      this.currentValidationError = this.translate.instant('add-event-dialog.dateTimeValidation');
      return;
    }

    this.currentValidationError = "";
    this.formValid = true;
  }

  /**
   * Function for removing the focus on the currently active element.
   * Needed to remove the focus ripple effect of Material checkbox elements that would be stuck otherwise.
   */
  blur() {
    let active = document.activeElement as HTMLElement;
    active.blur();
  }
}
