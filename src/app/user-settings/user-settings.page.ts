import { Component, OnInit, OnDestroy } from "@angular/core";
import { Validators, FormArray, FormBuilder } from "@angular/forms";
import { Subscription } from "rxjs";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

import { UserSettingsService } from "./user-settings.service";

@Component({
  selector: "app-user-settings",
  templateUrl: "./user-settings.page.html",
  styleUrls: ["./user-settings.page.scss"],
})
export class UserSettingsPage implements OnInit, OnDestroy {
  // public userSettingsForm = new FormGroup({
  //   name: new FormControl(null, [Validators.required]),
  //   email: new FormControl(null, [Validators.required, Validators.email]),
  //   password: new FormControl(null),
  //   telegramIds: new FormArray([]),
  // });
  public userSettingsForm = this.formBuilder.group({
    name: this.formBuilder.control(null, Validators.required),
    email: this.formBuilder.control(null, [
      Validators.required,
      Validators.email,
    ]),
    password: this.formBuilder.control(null, [Validators.minLength(8)]),
    telegramIds: this.formBuilder.array([]),
  });
  public isLoading = false;

  private userSettingsSub: Subscription;

  constructor(
    private userSettingsService: UserSettingsService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  get telegramIds() {
    return this.userSettingsForm.get("telegramIds") as FormArray;
  }

  ngOnInit() {
    this.userSettingsSub = this.userSettingsService.userSettings.subscribe(
      (userSettings) => {
        if (userSettings) {
          this.userSettingsForm.patchValue({
            name: userSettings.name,
            email: userSettings.email,
          });
          this.telegramIds.clear();
          for (let tId of userSettings.telegramIds) {
            this.telegramIds.push(
              this.formBuilder.group({
                name: this.formBuilder.control(tId.name, Validators.required),
                telegramId: this.formBuilder.control(
                  tId.telegramId,
                  Validators.required
                ),
              })
            );
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.userSettingsSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.userSettingsService.getSettings().subscribe(
      () => {
        this.isLoading = false;
      },
      (error) => {
        let msg = "Cannot fetch the data. Please try again later";
        if (error.status !== 0) {
          msg = error.error.message;
        }
        this.showToast(msg, "danger");
      }
    );
  }

  ionViewWillLeave() {
    this.userSettingsForm.reset();
    this.telegramIds.reset();
  }

  onSubmit() {
    this.isLoading = true;
    this.userSettingsService
      .updateSettings(this.userSettingsForm.value)
      .subscribe(
        (res) => {
          this.isLoading = false;
          this.showToast(res.message, "success");
          this.router.navigateByUrl("/dashboard");
        },
        (error) => {
          console.log(error);
          let msg = "Cannot update the data. Please try again later";
          if (error.status !== 0) {
            msg = error.error.message;
          }
          this.showToast(msg, "danger");
          this.isLoading = false;
        }
      );
  }

  onCancel() {
    this.router.navigateByUrl("/dashboard");
  }

  onAddTelegramId() {
    this.telegramIds.push(
      this.formBuilder.group({
        name: [null, Validators.required],
        telegramId: [null, Validators.required],
      })
    );
  }

  onRemoveTelegramId(index) {
    this.telegramIds.removeAt(index);
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
