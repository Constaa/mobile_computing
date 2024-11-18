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

  getCalendarEvents(): Observable<CalendarEvent[]> {
    return this.httpClient.get(this.apiUrl + "/getEvents", { observe: 'response' }).pipe(map(x =>
      <CalendarEvent[]>x.body
    ));
  }
}
