import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CalendarEvent } from '../models/calendarEvent';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl: string = environment.baseUrl;

  constructor(private httpClient: HttpClient, private _snackBar: MatSnackBar, private translate: TranslateService) { }

  /**
   * Function for getting calendar event data from the backend.
   * @returns Observable list of CalendarEvent objects that represent the event data received from the backend.
   */
  getCalendarEvents(): Observable<CalendarEvent[]> {
    return this.httpClient.get(`${this.apiUrl}/getEvents`, { observe: 'response' }).pipe(map(x =>
      //Map the received data to a list of CalendarEvents for further handling.
      <CalendarEvent[]>x.body
    ));
  }

  /**
   * Function for adding a new event to the database.
   * @param event CalendarEvent object that represents the new event that should be added to the database.
   * @returns Subscription to the received response from the backend.
   */
  addCalendarEvent(event: CalendarEvent) {
    return this.httpClient.post<CalendarEvent>(this.apiUrl + "/addEvent", event, { observe: 'response' }).pipe(map(x => {
      if (x.status == 200) {
        //Show confirmation notification on successfull execution.
        this.openSnackbar(this.translate.instant('service.addEventSuccess'), "successSnackbar");
        return;
      }
      else if (x.status == 400) {
        setTimeout(
          () =>
            this.openSnackbar(this.translate.instant('service.badRequest'), "errorSnackbar")
        );
        return;
      }
      this.openSnackbar(x.statusText, "errorSnackbar");
      return;
    })).subscribe();
  }

  deleteCalendarEvent(id: number) {
    return this.httpClient.delete(`${this.apiUrl}/deleteEvent?id=${id}`, { observe: 'response' }).pipe(map(x => {
      if (x.status == 200) {
        //Show confirmation notification on successfull execution.
        this.openSnackbar(this.translate.instant('service.deleteEventSuccess'), "successSnackbar");
        return;
      }
      else if (x.status == 400) {
        setTimeout(
          () =>
            this.openSnackbar(this.translate.instant('service.badRequest'), "errorSnackbar")
        );
        return;
      }
      this.openSnackbar(x.statusText, "errorSnackbar");
      return;
    })).subscribe();
  }

  /**
   * Function for displaying status notifications.
   * @param message The message that should be displayed in the notification
   * @param type The type of the notification. The type is added as a CSS class to the notification for styling.
   */
  openSnackbar(message: string, type: string) {
    //Setup config of notification.
    var snackBarConfig: MatSnackBarConfig = {
      horizontalPosition: "end",
      duration: 7000,
      panelClass: type
    }

    //Display notification.
    this._snackBar.open(message, "", snackBarConfig);
  }
}
