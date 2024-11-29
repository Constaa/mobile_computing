import { Component, inject } from '@angular/core';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { AdminComponent } from '../admin/admin.component';
import { MatIconModule } from '@angular/material/icon';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
import { CalendarEvent } from '../../shared/models/calendarEvent';
import { CalendarService } from '../../shared/services/calendar.service';

@Component({
  selector: 'app-add-event-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatIconModule, FormsModule, MatInputModule, MatFormFieldModule, MatDatepickerModule, MatNativeDateModule, ReactiveFormsModule, TranslateModule],
  providers: [provideNativeDateAdapter()],
  templateUrl: './add-event-dialog.component.html',
  styleUrl: './add-event-dialog.component.scss'
})
export class AddEventDialogComponent {
  readonly dialogRef = inject(MatDialogRef<AdminComponent>);
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });
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

  constructor(private calendarService: CalendarService) { }

  /**
   * Function for closing the dialog window.
   */
  cancel(): void {
    this.dialogRef.close();
  }

  addCalendarEvent() {
    this.newEvent.title = this.eventTitle;
    this.newEvent.description = this.eventDescription;
    this.eventStartDate.setHours(15, 0, 0);
    this.newEvent.start = this.eventStartDate;
    this.eventEndDate.setHours(18, 0, 0);
    this.newEvent.end = this.eventEndDate;

    console.log(this.newEvent);
    this.calendarService.addCalendarEvent(this.newEvent);

    this.cancel();
  }
}
