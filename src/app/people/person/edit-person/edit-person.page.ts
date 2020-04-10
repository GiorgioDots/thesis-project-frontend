import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Person } from "../../person.model";
import { PeopleService } from "../../people.service";
import { ToastController } from "@ionic/angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";

@Component({
  selector: "app-edit-person",
  templateUrl: "./edit-person.page.html",
  styleUrls: ["./edit-person.page.scss"],
})
export class EditPersonPage implements OnInit {
  public personId: String;
  public person: Person;
  public isLoading = false;
  public personForm: FormGroup;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private peopleService: PeopleService,
    private toastCtrl: ToastController
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
          this.personForm.patchValue({
            name: this.person.name,
            description: this.person.description,
            doNotify: this.person.doNotify,
          });
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
    this.personForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      description: new FormControl(null),
      doNotify: new FormControl(null),
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.peopleService
      .updatePerson(this.personId, this.personForm.value)
      .subscribe(
        (response) => {
          this.showToast(response.message, "success");
          this.router.navigate(["/", "people", this.personId]);
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
