import { Injectable } from "@angular/core";
import { Person } from "./person.model";
import { BehaviorSubject } from "rxjs";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { AuthService } from "../auth/auth.service";
import { take, switchMap, tap, map } from "rxjs/operators";
import { environment } from "src/environments/environment.prod";

interface GetPeopleResponseData {
  message: String;
  people: Person[];
  totalPeople: Number;
}
interface PersonResponseData {
  message: String;
  person: Person;
}

@Injectable({
  providedIn: "root",
})
export class PeopleService {
  private _people = new BehaviorSubject<Person[]>(null);

  get people() {
    return this._people.asObservable().pipe((people) => {
      if (!people) {
        return null;
      } else {
        return people;
      }
    });
  }

  constructor(private http: HttpClient, private authService: AuthService) {}

  getPeople(page: Number, perPage: Number) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<GetPeopleResponseData>(
          `${environment.BACKEND_URL}/people`,
          {
            headers: new HttpHeaders({
              Authorization: `Bearer ${token}`,
            }),
          }
        );
      }),
      map((response) => {
        response.people = response.people.map((p) => {
          return {
            ...p,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
          };
        });
        return response;
      }),
      take(1),
      tap((response) => {
        this._people.next(response.people);
      })
    );
  }

  getPerson(personId) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<PersonResponseData>(
          `${environment.BACKEND_URL}/people/${personId}`,
          {
            headers: new HttpHeaders({
              Authorization: `Bearer ${token}`,
            }),
          }
        );
      }),
      take(1),
      map((res) => {
        const person = new Person(
          res.person._id,
          res.person.name,
          res.person.description,
          res.person.counter,
          res.person.imageUrl,
          res.person.doNotify,
          new Date(res.person.createdAt),
          new Date(res.person.updatedAt)
        );
        return {
          person: person,
          message: res.message,
        };
      })
    );
  }

  deletePerson(personId) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `${environment.BACKEND_URL}/people/${personId}`,
          {
            headers: new HttpHeaders({
              Authorization: `Bearer ${token}`,
            }),
          }
        );
      }),
      switchMap(() => {
        return this.people;
      }),
      take(1),
      tap((people) => {
        this._people.next(people.filter((p) => p._id !== personId));
      })
    );
  }

  createPerson(data: {
    name: String;
    description: String;
    doNotify: Boolean;
    image: File;
  }) {
    let body = new FormData();
    body.append("image", data.image);
    body.append("name", `${data.name}`);
    body.append("description", `${data.description}`);
    body.append("doNotify", `${data.doNotify}`);
    let newPerson: Person;
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.post<PersonResponseData>(
          `${environment.BACKEND_URL}/people`,
          body,
          {
            headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
          }
        );
      }),
      switchMap((result) => {
        newPerson = result.person;
        return this.people;
      }),
      take(1),
      tap((people) => {
        people.push(newPerson);
        this._people.next(people);
      })
    );
  }

  updatePerson(personId: String, data) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.put<PersonResponseData>(
          `${environment.BACKEND_URL}/people/${personId}`,
          data,
          {
            headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
          }
        );
      }),
      take(1)
    );
  }

  resetPersonCounter(personId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.post<PersonResponseData>(
          `${environment.BACKEND_URL}/people/reset-counter/${personId}`,
          {},
          {
            headers: new HttpHeaders({ Authorization: `Bearer ${token}` }),
          }
        );
      }),
      take(1)
    );
  }
}
