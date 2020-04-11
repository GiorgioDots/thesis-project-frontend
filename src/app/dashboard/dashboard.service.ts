import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Dashboard } from "./dashboard.model";
import { AuthService } from "../auth/auth.service";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { take, switchMap, tap } from "rxjs/operators";
import { environment } from "src/environments/environment.prod";

@Injectable({
  providedIn: "root",
})
export class DashboardService {
  private _dashboard = new BehaviorSubject<Dashboard>(null);

  get dashboard() {
    return this._dashboard.asObservable();
  }

  constructor(private authService: AuthService, private http: HttpClient) {}

  getDashboard() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<Dashboard>(
          `${environment.BACKEND_URL}/user/dashboard`,
          {
            headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
          }
        );
      }),
      tap((response: Dashboard) => {
        return this._dashboard.next(response);
      })
    );
  }

  togglePlantStatus(action) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.post(
          `${environment.BACKEND_URL}/user/toggle-plant-status`,
          {
            action: action,
          },
          {
            headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
          }
        );
      }),
      take(1),
      switchMap(() => {
        return this.getDashboard();
      })
    );
  }
}
