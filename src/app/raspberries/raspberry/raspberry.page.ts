import { Component, OnInit, OnDestroy } from "@angular/core";
import { RaspberriesService } from "../raspberries.service";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { ToastController } from "@ionic/angular";
import { Raspberry } from "../raspberry.model";
import { Socket } from "ngx-socket-io";

@Component({
  selector: "app-raspberry",
  templateUrl: "./raspberry.page.html",
  styleUrls: ["./raspberry.page.scss"],
})
export class RaspberryPage implements OnInit, OnDestroy {
  private raspiSub: Subscription;
  public isLoading = false;
  public raspiId: String;
  public raspberry: Raspberry;
  public slideOpts = {
    speed: 400,
  };
  constructor(
    private raspiService: RaspberriesService,
    private route: ActivatedRoute,
    private router: Router,
    private toastCtrl: ToastController,
    private socket: Socket
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("raspiId")) {
        this.router.navigateByUrl("/raspberries");
        return;
      }
      this.raspiId = paramMap.get("raspiId");
      this.raspiSub = this.raspiService.raspberry.subscribe((raspberry) => {
        if (!raspberry) {
          return;
        }
        this.raspberry = raspberry;
        this.raspberry.lastImages = this.raspberry.lastImages.reverse();
      });
    });

    this.socket.on("live-stream-image", this.updateLastImage.bind(this));
  }

  ionViewWillEnter() {
    this.raspiService.getRaspberry(this.raspiId).subscribe(
      (response) => {
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        let msg = "Cannot get the data. Please try again later.";
        if (error) {
          msg = error.error.message;
        }
        this.showToast(msg, "danger");
        this.router.navigateByUrl("/raspberries");
        this.isLoading = false;
      }
    );
  }

  ngOnDestroy() {
    this.raspiSub.unsubscribe();
  }

  onToggleStatus() {
    this.isLoading = true;
    let data = {
      isActive: !this.raspberry.isActive,
    };
    this.raspiService.updateRaspberry(this.raspiId, data).subscribe(
      (response) => {
        this.isLoading = false;
        this.raspberry = response.raspberry;
        this.showToast(
          `Raspberry ${
            this.raspberry.isActive ? "activated" : "disactivated"
          } successfully.`,
          "success"
        );
      },
      (error) => {
        console.log(error);
        let msg = "Cannot update the raspberry. Please try again later.";
        if (error) {
          msg = error.error.message;
        }
        this.showToast(msg, "danger");
        this.router.navigateByUrl("/raspberries");
        this.isLoading = false;
      }
    );
  }

  onEdit() {
    this.router.navigate(["/", "raspberries", this.raspiId, "edit"]);
  }

  updateLastImage(msg) {
    if (!msg) {
      return;
    }
    const newImages = JSON.parse(msg).reverse();
    this.raspberry.lastImages = newImages;
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
