import { Injectable } from "@angular/core";
import { BehaviorSubject, from } from "rxjs";
import { User } from "./user.model";
import { map, tap } from "rxjs/operators";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Plugins } from "@capacitor/core";

import { environment } from "../../environments/environment.prod";

export interface UserInfo {
  id: String;
  email: String;
  name: String;
  telegramIds?: [{
    _id: String;
    name: String;
    telegramId: String;
  }];
}

export interface AuthResponseData {
  message: String;
  user: UserInfo;
  token: String;
}

@Injectable({
  providedIn: "root",
})
export class AuthService {
  private _user = new BehaviorSubject<User>(null);

  constructor(private http: HttpClient) {}

  get userIsAuthenticated() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  get user() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return {
            email: user.email,
            name: user.name,
            id: user.id,
          };
        } else {
          return null;
        }
      })
    );
  }

  signup(name: String, email: String, password: String) {
    return this.http
      .post<AuthResponseData>(
        `${environment.BACKEND_URL}/auth/signup`,
        { name: name, email: email, password: password },
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
        }
      )
      .pipe(tap(this.storeAuthData.bind(this)));
  }

  login(email: String, password: String) {
    return this.http
      .put<AuthResponseData>(
        `${environment.BACKEND_URL}/auth/login`,
        { email: email, password: password },
        {
          headers: new HttpHeaders({
            "Content-Type": "application/json",
          }),
        }
      )
      .pipe(tap(this.storeAuthData.bind(this)));
  }

  logout() {
    Plugins.Storage.remove({ key: "authData" });
    this._user.next(null);
  }

  storeAuthData(data: AuthResponseData) {
    const user = new User(
      data.user.id,
      data.user.email,
      data.user.name,
      data.token
    );
    this._user.next(user);
    Plugins.Storage.set({ key: "authData", value: JSON.stringify(user) });
  }

  autoLogin() {
    return from(Plugins.Storage.get({ key: "authData" })).pipe(
      map((storedData) => {
        if (!storedData || !storedData.value) {
          return null;
        }
        const jData = JSON.parse(storedData.value);
        const user = new User(jData.id, jData.email, jData.name, jData._token);
        return user;
      }),
      tap((user) => {
        if (user) {
          this._user.next(user);
        }
      }),
      map((user) => {
        return !!user;
      })
    );
  }
}
