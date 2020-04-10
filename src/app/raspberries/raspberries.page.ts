import { Component, OnInit, OnDestroy } from "@angular/core";
import { RaspberriesService } from "./raspberries.service";
import { Subscription } from "rxjs";
import { Raspberry } from "./raspberry.model";
import { ToastController, Platform, ModalController } from "@ionic/angular";
import { Router } from "@angular/router";
import { AddRaspberryComponent } from "./add-raspberry/add-raspberry.component";

@Component({
  selector: "app-raspberries",
  templateUrl: "./raspberries.page.html",
  styleUrls: ["./raspberries.page.scss"],
})
export class RaspberriesPage implements OnInit, OnDestroy {
  private raspiSub: Subscription;
  private raspberries: Raspberry[];
  public filteredRaspberries: Raspberry[];
  public isLoading = false;
  public isDesktop: Boolean;

  constructor(
    private raspiService: RaspberriesService,
    private toastCtrl: ToastController,
    private platform: Platform,
    private router: Router,
    private modalCtrl: ModalController
  ) {}

  ngOnInit() {
    this.raspiSub = this.raspiService.raspberries.subscribe((raspberries) => {
      this.filteredRaspberries = raspberries;
      this.raspberries = raspberries;
    });
    this.isDesktop = this.platform.is("desktop");
  }

  ngOnDestroy() {
    this.raspiSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.raspiService.fetchRaspberries().subscribe(
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

  onDeleteRaspberry(raspiId) {
    this.isLoading = true;
    this.raspiService.deleteRaspberry(raspiId).subscribe(
      () => {
        this.isLoading = false;
        this.showToast("Deleted.", "success");
      },
      (error) => {
        console.log(error);
        let msg = "Cannot update the data. Please try again later";
        if (error) {
          msg = error.error.message;
        }
        this.showToast(msg, "danger");
        this.isLoading = false;
      }
    );
  }

  onAddRaspberry() {
    this.presentModal();
  }

  onOpenPerson(raspiId) {
    this.router.navigate(["/", "raspberries", raspiId]);
  }

  onSearch(event: any) {
    let filter = event.srcElement.value.toLowerCase();
    this.filteredRaspberries = [];
    this.raspberries.forEach((r) => {
      if (r.name.toLowerCase().indexOf(filter) > -1) {
        this.filteredRaspberries.push(r);
      }
    });
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
      component: AddRaspberryComponent,
      keyboardClose: true,
    });
    return await modal.present();
  }
}
