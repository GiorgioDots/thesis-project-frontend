import { Component, OnInit, OnDestroy } from "@angular/core";
import {
  Router,
  ActivatedRoute,
  NavigationEnd,
  RouterEvent,
} from "@angular/router";

import { Platform, ToastController } from "@ionic/angular";
import { Capacitor, Plugins } from "@capacitor/core";

import { Subscription } from "rxjs";

import { Socket } from "ngx-socket-io";

import { AuthService } from "./auth/auth.service";
import { EventsService } from "./events/events.service";
import { DashboardService } from "./dashboard/dashboard.service";
import { RaspberriesService } from "./raspberries/raspberries.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  private previousAuthState = false;
  private isAuthSub: Subscription;
  private userSub: Subscription;
  public eventSub: Subscription;
  public dashboardSub: Subscription;
  public user: { name: String; email: String; id: String };
  public isAuth = false;
  public selectedIndex = 0;
  public appPages = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: "home",
    },
    {
      title: "Events",
      url: "/events",
      icon: "warning",
    },
    {
      title: "People",
      url: "/people",
      icon: "people",
    },
    {
      title: "Raspberries",
      url: "/raspberries",
      icon: "videocam",
    },
    {
      title: "Your settings",
      url: "/user-settings",
      icon: "settings",
    },
  ];
  public labels = ["Family"];

  constructor(
    private platform: Platform,
    private authService: AuthService,
    private router: Router,
    private toastCtrl: ToastController,
    private socket: Socket,
    private eventsService: EventsService,
    private dashboardService: DashboardService,
    private raspberriesService: RaspberriesService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      if (Capacitor.isPluginAvailable("SplashScreen")) {
        Plugins.SplashScreen.hide();
      }
    });
  }

  ngOnInit() {
    this.isAuthSub = this.authService.userIsAuthenticated.subscribe(
      (isAuth) => {
        if (!isAuth && this.previousAuthState !== isAuth) {
          this.router.navigateByUrl("/auth");
        }
        this.previousAuthState = isAuth;
        this.isAuth = isAuth;
      }
    );
    this.userSub = this.authService.user.subscribe((user) => {
      if (!user) {
        return null;
      }
      this.user = user;
    });
    this.socket.on("event", this.onNewEvent.bind(this));
    this.socket.on(
      "live-stream-image",
      this.updateRaspberryLastImage.bind(this)
    );
    this.router.events.subscribe((ev) => {
      if (ev instanceof NavigationEnd) {
        const path = ev.url.split("/")[1];
        if (path !== undefined) {
          this.selectedIndex = this.appPages.findIndex(
            (page) => page.title.toLowerCase() === path.toLowerCase()
          );
        }
      }
    });
  }

  onNewEvent(msg) {
    const newEvent = JSON.parse(msg);
    this.eventsService.newEvent(newEvent).subscribe(() => {
      this.showNewEventToast(newEvent);
    });
    this.dashboardService.getDashboard().subscribe();
  }

  updateRaspberryLastImage(msg) {
    if (!msg) {
      return;
    }
    const newImages = JSON.parse(msg);
    this.raspberriesService
      .updateRaspberryLastImages(newImages.raspiId, newImages.images)
      .subscribe();
    this.dashboardService.getDashboard().subscribe();
  }

  onLogout() {
    this.authService.logout();
    this.showToast("Logged out.", "success");
    this.router.navigateByUrl("/auth");
  }

  ngOnDestroy() {
    if (this.isAuthSub) {
      this.isAuthSub.unsubscribe();
    }
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.eventSub) {
      this.eventSub.unsubscribe();
    }
    if (this.dashboardSub) {
      this.dashboardSub.unsubscribe();
    }
  }

  private async showToast(message, color) {
    const toastEl = await this.toastCtrl.create({
      animated: true,
      color: color,
      message: message,
      duration: 2500,
    });
    toastEl.present();
  }

  private async showNewEventToast(event) {
    const toastEl = await this.toastCtrl.create({
      position: "top",
      animated: true,
      color: "secondary",
      message: `New event! Click 'OPEN' to open it..`,
      duration: 3000,
      buttons: [
        {
          side: "end",
          text: "OPEN",
          handler: () => {
            this.router.navigate(["/", "events", event._id]);
          },
        },
      ],
    });
    toastEl.present();
  }
}
