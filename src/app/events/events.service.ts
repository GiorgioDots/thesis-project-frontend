import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { take, switchMap, tap } from "rxjs/operators";

import { AuthService } from "../auth/auth.service";
import { environment } from "../../environments/environment.prod";
import { Event } from "./event.model";

interface GetEventsResponse {
  message: String;
  events: Event[];
  totalEvents: number;
}

@Injectable({
  providedIn: "root",
})
export class EventsService {
  private _events = new BehaviorSubject<Event[]>([]);
  private _totalEvents = new BehaviorSubject<number>(0);
  constructor(private http: HttpClient, private authService: AuthService) {}

  get events() {
    return this._events.asObservable();
  }

  get totalEvents() {
    return this._totalEvents.asObservable();
  }

  getEvents(page: Number, perPage: Number) {
    let newEvents: Event[];
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<GetEventsResponse>(
          `${environment.BACKEND_URL}/events?page=${page}&perPage=${perPage}`,
          {
            headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
          }
        );
      }),
      take(1),
      switchMap((response) => {
        this._totalEvents.next(response.totalEvents);
        newEvents = response.events;
        return this.events;
      }),
      take(1),
      tap((events) => {
        this._events.next([...events, ...newEvents]);
      })
    );
  }

  getEvent(eventId) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{ message: string; event: Event }>(
          `${environment.BACKEND_URL}/events/${eventId}`,
          {
            headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
          }
        );
      }),
      take(1)
    );
  }

  deleteEvents() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete<{ message: string }>(
          `${environment.BACKEND_URL}/events`,
          {
            headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
          }
        );
      }),
      take(1),
      tap((response) => {
        this._events.next([]);
      }),
      switchMap((events) => {
        return this.totalEvents;
      }),
      take(1),
      tap((totalEvents) => {
        this._totalEvents.next(0);
      })
    );
  }

  deleteEvent(eventId) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete<{ message: string }>(
          `${environment.BACKEND_URL}/events/${eventId}`,
          {
            headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
          }
        );
      }),
      take(1),
      switchMap((response) => {
        return this.events;
      }),
      take(1),
      tap((events) => {
        this._events.next(events.filter((e) => e._id !== eventId));
      }),
      switchMap((events) => {
        return this.totalEvents;
      }),
      take(1),
      tap((totalEvents) => {
        this._totalEvents.next(totalEvents - 1);
      })
    );
  }

  newEvent(event) {
    return this.events.pipe(
      take(1),
      switchMap((events) => {
        this._events.next([event, ...events]);
        return this.totalEvents;
      }),
      take(1),
      tap((totalEvents) => {
        this._totalEvents.next(totalEvents + 1);
      })
    );
  }

  clearEvents() {
    this._events.next([]);
  }
}
