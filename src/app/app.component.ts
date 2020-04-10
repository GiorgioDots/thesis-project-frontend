import { Component, OnInit, OnDestroy } from "@angular/core";
import { Router } from "@angular/router";

import { Platform, ToastController } from "@ionic/angular";
import { Capacitor, Plugins } from "@capacitor/core";

import { Subscription } from "rxjs";

import { Socket } from 'ngx-socket-io';

import { AuthService } from "./auth/auth.service";

@Component({
  selector: "app-root",
  templateUrl: "app.component.html",
  styleUrls: ["app.component.scss"],
})
export class AppComponent implements OnInit, OnDestroy {
  private previousAuthState = false;
  private isAuthSub: Subscription;
  private userSub: Subscription;
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
    private toastCtrl: ToastController
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
    const path = window.location.pathname.split("/")[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex(
        (page) => page.title.toLowerCase() === path.toLowerCase()
      );
    }
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
