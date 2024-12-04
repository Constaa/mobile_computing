import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableModule } from '@angular/material/table';
import { Store } from '@ngrx/store';
import { TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { CalendarEvent } from '../../shared/models/calendarEvent';
import { CalendarService } from '../../shared/services/calendar.service';
import * as CalendarActions from '../../shared/store/calendar/calendar.actions';
import * as CalendarSelectors from '../../shared/store/calendar/calendar.selectors';
import { AddEventDialogComponent } from '../add-event-dialog/add-event-dialog.component';

@Component({
  selector: 'app-admin',
  imports: [FormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCardModule, MatIconModule, TranslateModule, MatTableModule, MatDividerModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit {
  readonly dialog = inject(MatDialog);
  isLoggedIn = false;
  username = '';
  password = '';
  calendarEvents$!: Observable<CalendarEvent[]>;
  calendarEvents: CalendarEvent[] = [];
  displayedColumns: string[] = ["id", "title", "description", "start", "end", "delete"];
  deleteDisabled: boolean = false;

  constructor(private service: CalendarService, private store: Store) { }

  /**
   * Internal Angular function that is called once when the component is being accessed.
   */
  ngOnInit() {
    this.calendarEvents$ = this.store.select(CalendarSelectors.selectCalendarEvents);
    this.calendarEvents$.subscribe(x => {
      this.calendarEvents = x;
      this.deleteDisabled = false;
    });

    //Dispatch a store action to initially load the calendar events.
    this.store.dispatch(CalendarActions.LoadCalendarEvents());
  }

  /**
   * Function for handling the login.
   * Currently only for demonstration purposes.
   */
  login() {
    if (this.username === 'admin' && this.password === 'password') {
      this.isLoggedIn = true;
    } else {
      alert('Ungültige Anmeldedaten!');
    }
  }

  /**
   * Function for deleting events from the database via its id.
   * @param id The id of the event that should be deleted from the database.
   */
  deleteEvent(id: number) {
    this.deleteDisabled = true;
    //Call the service function for accessing the backend delete function.
    this.service.deleteCalendarEvent(id);
    //Reload the current events after deletion
    setTimeout(() => {
      this.store.dispatch(CalendarActions.LoadCalendarEvents());
    }, 2000);
  }

  /**
   * Open the add-event-dialog dialog where new events can be added to the database.
   */
  openDialog(): void {
    const dialogRef = this.dialog.open(AddEventDialogComponent, { autoFocus: false, minWidth: "60%" });
  }
}