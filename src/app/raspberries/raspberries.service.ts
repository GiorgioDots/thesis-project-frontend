import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { take, switchMap, tap, map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";

import { AuthService } from "../auth/auth.service";
import { Raspberry } from "./raspberry.model";
import { environment } from "../../environments/environment.prod";

interface UpdateRaspberryData {
  confidence?: Number;
  resolution?: String;
  wifiPassword?: String;
  wifiSSID?: String;
  isActive?: Boolean;
  name?: String;
}

@Injectable({
  providedIn: "root",
})
export class RaspberriesService {
  private _raspberries = new BehaviorSubject<Raspberry[]>(null);
  private _raspberry = new BehaviorSubject<Raspberry>(null);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get raspberries() {
    return this._raspberries.asObservable();
  }

  get raspberry() {
    return this._raspberry.asObservable();
  }

  fetchRaspberries() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{ message: String; raspberries: Raspberry[] }>(
          `${environment.BACKEND_URL}/raspberry`,
          { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
        );
      }),
      take(1),
      map((response) => {
        response.raspberries = response.raspberries.map((r) => {
          return {
            ...r,
            createdAt: new Date(r.createdAt),
            updatedAt: new Date(r.updatedAt),
          };
        });
        return response;
      }),
      tap((response) => {
        this._raspberries.next(response.raspberries);
      })
    );
  }

  createRaspberry(raspiData) {
    let newRaspi: Raspberry;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.post<{ message: String; raspberry: Raspberry }>(
          `${environment.BACKEND_URL}/raspberry`,
          raspiData,
          { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
        );
      }),
      take(1),
      switchMap((response) => {
        newRaspi = new Raspberry(
          response.raspberry.name,
          response.raspberry.raspiId,
          response.raspberry.resolution,
          response.raspberry.confidence,
          response.raspberry.isActive,
          response.raspberry.lastImages,
          new Date(response.raspberry.createdAt),
          new Date(response.raspberry.updatedAt),
          response.raspberry.wifiSSID,
          response.raspberry.wifiPassword
        );
        return this.raspberries;
      }),
      take(1),
      tap((raspberries) => {
        raspberries.push(newRaspi);
        this._raspberries.next(raspberries);
      })
    );
  }

  deleteRaspberry(raspiId) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete<{ message: String }>(
          `${environment.BACKEND_URL}/raspberry/${raspiId}`,
          { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
        );
      }),
      take(1),
      switchMap(() => {
        return this.raspberries;
      }),
      take(1),
      tap((raspberries) => {
        const newRaspis = raspberries.filter((r) => r.raspiId !== raspiId);
        this._raspberries.next(newRaspis);
      })
    );
  }

  getRaspberry(raspiId) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{ message: String; raspberry: Raspberry }>(
          `${environment.BACKEND_URL}/raspberry/${raspiId}`,
          { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
        );
      }),
      take(1),
      map((response) => {
        response.raspberry = {
          ...response.raspberry,
          createdAt: new Date(response.raspberry.createdAt),
          updatedAt: new Date(response.raspberry.updatedAt),
        };
        return response;
      }),
      tap((response) => {
        this._raspberry.next(response.raspberry);
      })
    );
  }

  updateRaspberry(raspiId, data: UpdateRaspberryData) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.put<{ message: String; raspberry: Raspberry }>(
          `${environment.BACKEND_URL}/raspberry/${raspiId}`,
          data,
          { headers: new HttpHeaders({ Authorization: `Bearer ${token}` }) }
        );
      }),
      take(1),
      map((response) => {
        response.raspberry = {
          ...response.raspberry,
          createdAt: new Date(response.raspberry.createdAt),
          updatedAt: new Date(response.raspberry.updatedAt),
        };
        return response;
      }),
      tap((response) => {
        this._raspberry.next(response.raspberry);
      })
    );
  }
}
