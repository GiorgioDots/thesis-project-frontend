import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { Person } from "../person.model";
import { PeopleService } from "../people.service";

@Component({
  selector: "app-person",
  templateUrl: "./person.page.html",
  styleUrls: ["./person.page.scss"],
})
export class PersonPage implements OnInit {
  private personId: String;
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
      this.peopleService.getPerson(this.personId).subscribe(
        (response) => {
          this.person = response.person;
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          let msg = "Cannot get the person. Please try again later";
          if (error.status !== 0) {
            msg = error.error.message;
          }
          this.isLoading = false;
          this.showToast(msg, "danger");
          this.router.navigateByUrl("/people");
        }
      );
    });
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
