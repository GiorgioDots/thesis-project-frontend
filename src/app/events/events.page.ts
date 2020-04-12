import { Component, OnInit, OnDestroy, ViewChild } from "@angular/core";

import { EventsService } from "./events.service";
import { Event } from "./event.model";
import { Subscription } from "rxjs";
import {
  ToastController,
  IonInfiniteScroll,
  AlertController,
  Platform,
} from "@ionic/angular";
import { Router } from "@angular/router";

@Component({
  selector: "app-events",
  templateUrl: "./events.page.html",
  styleUrls: ["./events.page.scss"],
})
export class EventsPage implements OnInit, OnDestroy {
  public isLoading = false;
  public events: Event[] = [];
  public totalEvents: number;
  public currentPage = 1;
  public disableScroll = false;
  public isDesktop: boolean;
  private perPage = 20;
  private eventsSub: Subscription;
  private totalEvSub: Subscription;
  private infiniteScrollItem;

  constructor(
    private eventsService: EventsService,
    private toastCtrl: ToastController,
    private alertCtrl: AlertController,
    private platform: Platform,
    private router: Router
  ) {}

  ngOnInit() {
    this.eventsService.events.subscribe((events) => {
      this.events = events;
    });
    this.eventsService.totalEvents.subscribe((totalEvents) => {
      this.totalEvents = totalEvents;
    });
    this.isDesktop = this.isDesktop = this.platform.is("desktop");
  }

  ngOnDestroy() {
    if (this.eventsSub) {
      this.eventsSub.unsubscribe();
    }
    if (this.totalEvSub) {
      this.totalEvSub.unsubscribe();
    }
  }

  ionViewWillLeave() {
    this.currentPage = 1;
    this.events = [];
    this.eventsService.clearEvents();
  }

  ionViewWillEnter() {
    this.currentPage = 1;
    this.events = [];
    this.isLoading = true;
    this.onGetEvents(null);
  }

  loadData(event) {
    this.currentPage++;
    if (
      this.perPage * this.currentPage >
      this.totalEvents + (this.perPage - (this.totalEvents % this.perPage))
    ) {
      event.target.disabled = true;
      this.infiniteScrollItem = event.target;
    } else {
      this.onGetEvents(event);
    }
  }

  onGetEvents(event) {
    this.eventsService.getEvents(this.currentPage, this.perPage).subscribe(
      () => {
        this.isLoading = false;
        if (event) {
          event.target.complete();
        }
      },
      (error) => {
        console.log(error);
        let msg = "Cannot fetch the events. Please try again later";
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

  onDeleteEvents() {
    this.showConfirmAlert();
  }

  onDeleteEvent(eventId) {
    this.deleteEvent(eventId);
  }

  onOpenEvent(eventId) {
    this.router.navigate(["/", "events", eventId]);
  }

  private deleteEvents() {
    this.isLoading = true;
    this.eventsService.deleteEvents().subscribe(
      (response) => {
        this.isLoading = false;
        if (this.infiniteScrollItem) {
          this.infiniteScrollItem.disabled = false;
          this.infiniteScrollItem = null;
        }
        this.showToast("Events deleted.", "primary");
      },
      (error) => {
        console.log(error);
        let msg = "Cannot delete the events. Please try again later";
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

  private deleteEvent(eventId) {
    this.isLoading = true;
    this.eventsService.deleteEvent(eventId).subscribe(
      () => {
        this.isLoading = false;
        if (this.infiniteScrollItem) {
          if (this.totalEvents == 0) {
            this.infiniteScrollItem.disabled = false;
            this.infiniteScrollItem = null;
          }
        }
        this.showToast("Event deleted.", "success");
      },
      (error) => {
        console.log(error);
        let msg = "Cannot delete the events. Please try again later";
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

  private async showConfirmAlert() {
    const alert = await this.alertCtrl.create({
      header: `Delete the events?`,
      message: "This operation is <strong>irreversible</strong>.",
      buttons: [
        {
          text: "Cancel",
          role: "cancel",
          handler: () => {
            this.showToast("Operation cancelled.", "success");
          },
        },
        {
          text: "Okay",
          handler: () => {
            this.deleteEvents();
          },
        },
      ],
    });

    await alert.present();
  }
}
