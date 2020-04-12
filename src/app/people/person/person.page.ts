import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { Person } from "../person.model";
import { PeopleService } from "../people.service";
import { Subscription } from "rxjs";

@Component({
  selector: "app-person",
  templateUrl: "./person.page.html",
  styleUrls: ["./person.page.scss"],
})
export class PersonPage implements OnInit, OnDestroy {
  private personId: string;
  private personSub: Subscription;
  public isLoading = false;
  public person: Person;

  constructor(
    private route: ActivatedRoute,
    private toastCtrl: ToastController,
    private router: Router,
    private peopleService: PeopleService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("personId")) {
        this.router.navigateByUrl("/people");
        return;
      }
      this.personId = paramMap.get("personId");
      this.isLoading = true;
      this.personSub = this.peopleService.getPerson(this.personId).subscribe(
        (response) => {
          this.person = response.person;
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          let msg = "Cannot get the person. Please try again later";
          if (error.error.message) {
            msg = error.error.message;
          }
          this.showToast(msg, "danger");
          this.isLoading = false;
          this.router.navigateByUrl("/people");
        }
      );
    });
  }

  ngOnDestroy() {
    this.personSub.unsubscribe();
  }

  onResetCounter() {
    this.isLoading = true;
    this.peopleService.resetPersonCounter(this.personId).subscribe(
      (response) => {
        this.showToast(response.message, "success");
        this.person = response.person;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        let msg = "Cannot reset the person's counter. Please try again later";
        if (error.error) {
          if (error.error.message) {
            msg = error.error.message;
          }
        }
        this.showToast(msg, "danger");
        this.isLoading = false;
      }
    );
  }

  onEdit() {
    this.router.navigate(["/", "people", this.personId, "edit"]);
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
}
