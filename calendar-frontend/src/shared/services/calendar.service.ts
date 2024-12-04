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

  addCalendarEvent(event: CalendarEvent) {
    //TODO: Add callback listener to check successful execution
    console.log("service");
    return this.httpClient.post<CalendarEvent>(this.apiUrl + "/addEvent", event, { observe: 'response' }).pipe(map(x => {
      if (x.status == 200) {
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

  openSnackbar(message: string, type: string) {
    var snackBarConfig: MatSnackBarConfig = {
      horizontalPosition: "end",
      duration: 7000,
      panelClass: type
    }
    this._snackBar.open(message, "", snackBarConfig);
  }
}
