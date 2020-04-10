import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { UserSettings } from "./user-settings.model";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { environment } from "../../environments/environment.prod";
import { AuthService } from "../auth/auth.service";
import { take, switchMap, map, tap } from "rxjs/operators";

@Injectable({
  providedIn: "root",
})
export class UserSettingsService {
  private _userSettings = new BehaviorSubject<UserSettings>(null);

  constructor(private http: HttpClient, private authService: AuthService) {}

  get userSettings() {
    return this._userSettings.asObservable();
  }

  getSettings() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get(`${environment.BACKEND_URL}/user/settings`, {
          headers: new HttpHeaders({
            Authorization: `Bearer ${token}`,
          }),
        });
      }),
      map((resData: UserSettings) => {
        return new UserSettings(
          resData.id,
          resData.email,
          resData.name,
          resData.telegramIds
        );
      }),
      tap((userSettings) => {
        this._userSettings.next(userSettings);
      })
    );
  }

  updateSettings(settings: UserSettings) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.put(
          `${environment.BACKEND_URL}/user`,
          settings,
          {
            headers: new HttpHeaders({
              Authorization: `Bearer ${token}`,
            }),
          }
        );
      }),
      tap((resData: { message: String; user: UserSettings }) => {
        this._userSettings.next(resData.user);
      })
    );
  }
}
