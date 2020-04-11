import { Component, OnInit, OnDestroy } from "@angular/core";
import { FormGroup, FormControl, Validators } from "@angular/forms";
import { THIS_EXPR } from "@angular/compiler/src/output/output_ast";
import { RaspberriesService } from "../../raspberries.service";
import { ActivatedRoute, Router } from "@angular/router";
import { ToastController } from "@ionic/angular";
import { Subscription } from "rxjs";
import { Raspberry } from "../../raspberry.model";

@Component({
  selector: "app-edit-raspberry",
  templateUrl: "./edit-raspberry.page.html",
  styleUrls: ["./edit-raspberry.page.scss"],
})
export class EditRaspberryPage implements OnInit, OnDestroy {
  public isLoading = false;
  public raspiForm: FormGroup;
  public resolutions = ["1920x1080", "1280x720", "640x480"];
  public selectedResolution: String;
  public raspberry: Raspberry;
  public showPassword = false;
  private raspiId: String;
  private raspiSub: Subscription;

  constructor(
    private raspiService: RaspberriesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.raspiForm = new FormGroup({
      name: new FormControl(null, Validators.required),
      confidence: new FormControl(50, [
        Validators.required,
        Validators.min(1),
        Validators.max(99),
      ]),
      resolution: new FormControl(null),
      useWifi: new FormControl(false),
      wifiSSID: new FormControl(null),
      wifiPassword: new FormControl(null),
    });
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("raspiId")) {
        this.router.navigateByUrl("raspberries");
        return;
      }
      this.raspiId = paramMap.get("raspiId");
      this.raspiSub = this.raspiService.raspberry.subscribe((raspberry) => {
        if (!raspberry) {
          return;
        }
        this.raspberry = raspberry;
        this.raspiForm.patchValue({
          name: raspberry.name,
          confidence: raspberry.confidence,
          resolution: raspberry.resolution,
          useWifi: raspberry.wifiSSID ? true : false,
          wifiSSID: raspberry.wifiSSID,
          wifiPassword: raspberry.wifiPassword,
        });
        this.isLoading = false;
      });
    });
  }

  ngOnDestroy() {
    if (this.raspiSub) {
      this.raspiSub.unsubscribe();
    }
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.raspiService.getRaspberry(this.raspiId).subscribe(
      (response) => {
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        let msg = "Cannot update the raspberry. Please try again later.";
        if (error.error) {
          msg = error.error.message;
        }
        this.showToast(msg, "danger");
        this.isLoading = false;
      }
    );
  }

  onSubmit() {
    this.isLoading = true;
    const data = this.raspiForm.value;
    if (!data.useWifi) {
      data.wifiSSID = null;
      data.wifiPassword = null;
    }
    this.raspiService.updateRaspberry(this.raspiId, data).subscribe(
      (response) => {
        this.isLoading = false;
        this.showToast(response.message, "success");
      },
      (error) => {
        console.log(error);
        let msg = "Cannot update the raspberry. Please try again later.";
        if (error.error) {
          msg = error.error.message;
        }
        this.showToast(msg, "danger");
        this.isLoading = false;
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
