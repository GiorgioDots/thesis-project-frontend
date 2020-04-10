import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Raspberry } from "./raspberry.model";
import { AuthService } from "../auth/auth.service";
import { take, switchMap, tap, map } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class RaspberriesService {
  private _raspberries = new BehaviorSubject<Raspberry[]>(null);

  constructor(private authService: AuthService, private http: HttpClient) {}

  get raspberries() {
    return this._raspberries.asObservable();
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
          new Date(response.raspberry.updatedAt)
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
}
