import { Component, OnInit } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import { Event } from "../event.model";
import { EventsService } from "../events.service";
import { ToastController } from "@ionic/angular";

@Component({
  selector: "app-event",
  templateUrl: "./event.page.html",
  styleUrls: ["./event.page.scss"],
})
export class EventPage implements OnInit {
  public event: Event;
  public isLoading = false;
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventsService,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.route.paramMap.subscribe((paramMap) => {
      if (!paramMap.has("eventId")) {
        this.router.navigateByUrl("/events");
        return;
      }
      const eventId = paramMap.get("eventId");
      this.eventsService.getEvent(eventId).subscribe(
        (response) => {
          this.event = response.event;
          this.isLoading = false;
        },
        (error) => {
          console.log(error);
          let msg = "Cannot fetch the event. Please try again later";
          if (error.error) {
            if (error.error.message) {
              msg = error.error.message;
            }
          }
          this.showToast(msg, "danger");
          this.isLoading = false;
        }
      );
    });
  }

  goToPerson() {
    this.router.navigate(["/", "people", this.event.person._id]);
  }

  goToRaspberry() {
    this.router.navigate(["/", "raspberries", this.event.raspiId]);
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
