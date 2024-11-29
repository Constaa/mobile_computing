import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { CalendarEvent } from '../models/calendarEvent';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private apiUrl: string = environment.baseUrl;

  constructor(private httpClient: HttpClient) { }

  /**
   * Function for getting calendar event data from the backend.
   * @returns Observable list of CalendarEvent objects that represent the event data received from the backend.
   */
  getCalendarEvents(): Observable<CalendarEvent[]> {
    return this.httpClient.get(this.apiUrl + "/getEvents", { observe: 'response' }).pipe(map(x =>
      //Map the received data to a list of CalendarEvents for further handling.
      <CalendarEvent[]>x.body
    ));
  }

  addCalendarEvent(event: CalendarEvent) {
    //TODO: Add callback listener to check successful execution
    console.log("service");
    return this.httpClient.post<CalendarEvent>(this.apiUrl + "/addEvent", event, { observe: 'response' }).subscribe(x => console.log(x));
  }
}
