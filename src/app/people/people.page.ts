import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ToastController, Platform, ModalController } from "@ionic/angular";
import { Router } from "@angular/router";

import { Person } from "./person.model";
import { PeopleService } from "./people.service";
import { AddPersonComponent } from "./add-person/add-person.component";

@Component({
  selector: "app-people",
  templateUrl: "./people.page.html",
  styleUrls: ["./people.page.scss"],
})
export class PeoplePage implements OnInit, OnDestroy {
  private perPage = 10;
  private people: Person[];
  public page = 1;
  public getPeopleSub: Subscription;
  public filteredPeople: Person[] = [];
  public isLoading = false;
  public isDesktop: Boolean;

  constructor(
    private peopleService: PeopleService,
    private toastCtrl: ToastController,
    private platform: Platform,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.getPeopleSub = this.peopleService.people.subscribe((people) => {
      this.people = people;
      this.filteredPeople = people;
    });
    this.isDesktop = this.platform.is("desktop");
  }

  ngOnDestroy() {
    this.getPeopleSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.peopleService.getPeople(this.page, this.perPage).subscribe(
      (response) => {
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        let msg = "Cannot update the data. Please try again later";
        if (error.error.message) {
          msg = error.error.message;
        }
        this.showToast(msg, "danger");
        this.isLoading = false;
      }
    );
  }

  ionViewWillLeave() {
    this.people = [];
  }

  onDeletePerson(personId) {
    this.isLoading = true;
    this.peopleService.deletePerson(personId).subscribe(
      () => {
        this.showToast("Success.", "success");
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        let msg = "Cannot delete the person. Please try again later";
        if (error.error.message) {
          msg = error.error.message;
        }
        this.showToast(msg, "danger");
        this.isLoading = false;
      }
    );
  }

  onAddPerson() {
    this.presentModal();
  }

  onSearch(event: any) {
    let filter = event.srcElement.value.toLowerCase();
    this.filteredPeople = [];
    this.people.forEach((p) => {
      if (p.name.toLowerCase().indexOf(filter) > -1) {
        this.filteredPeople.push(p);
      }
    });
  }

  onOpenPerson(personId) {
    this.router.navigate(["/", "people", personId]);
  }

  private async showToast(message, color) {
    const alertEl = await this.toastCtrl.create({
      animated: true,
      color: color,
      message: message,
      duration: 2500,
      keyboardClose: true,
    });
    alertEl.present();
  }

  private async presentModal() {
    const modal = await this.modalCtrl.create({
      component: AddPersonComponent,
      keyboardClose: true,
    });
    return await modal.present();
  }
}
