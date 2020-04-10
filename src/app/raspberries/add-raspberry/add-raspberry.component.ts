import { Component, OnInit } from "@angular/core";
import { ModalController, ToastController } from "@ionic/angular";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { RaspberriesService } from "../raspberries.service";

@Component({
  selector: "app-add-raspberry",
  templateUrl: "./add-raspberry.component.html",
  styleUrls: ["./add-raspberry.component.scss"],
})
export class AddRaspberryComponent implements OnInit {
  public isLoading = false;
  public raspiForm: FormGroup;
  public resolutions = ["1920x1080", "1280x720", "640x480"];

  constructor(
    private modalCtrl: ModalController,
    private toastCtrl: ToastController,
    private raspiService: RaspberriesService
  ) {}

  ngOnInit() {
    this.raspiForm = new FormGroup({
      raspiId: new FormControl(null, Validators.required),
      name: new FormControl(null, Validators.required),
      resolution: new FormControl("1280x720", Validators.required),
      confidence: new FormControl(50, [
        Validators.required,
        Validators.min(1),
        Validators.max(99),
      ]),
      useWifi: new FormControl(false),
      wifiSSID: new FormControl(null),
      wifiPassword: new FormControl(null),
    });
  }

  onSubmit() {
    this.isLoading = true;
    this.raspiService.createRaspberry(this.raspiForm.value).subscribe(
      (response) => {
        this.showToast("Success.", "success");
        this.onCancel();
      },
      (error) => {
        console.log(error);
        let msg = "Cannot create the raspberry. Please try again later";
        if (error.error.message) {
          msg = error.error.message;
        }
        this.showToast(msg, "danger");
        this.isLoading = false;
      }
    );
  }

  onCancel() {
    this.modalCtrl.dismiss();
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
