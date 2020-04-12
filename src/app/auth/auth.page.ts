import { Component, OnInit } from "@angular/core";
import { NgForm } from "@angular/forms";
import { AuthService, AuthResponseData } from "./auth.service";
import { LoadingController, ToastController } from "@ionic/angular";
import { Observable } from "rxjs";
import { Router } from "@angular/router";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.page.html",
  styleUrls: ["./auth.page.scss"],
})
export class AuthPage implements OnInit {
  isLogin = true;

  constructor(
    private authService: AuthService,
    private loadingCtrl: LoadingController,
    private toastCtrl: ToastController,
    private router: Router
  ) {}

  ngOnInit() {}

  switchAuthMode(form: NgForm) {
    form.reset();
    this.isLogin = !this.isLogin;
  }

  async onSubmit(form: NgForm) {
    if (form.invalid) {
      return;
    }

    const loadingEl = await this.loadingCtrl.create({
      keyboardClose: true,
      message: this.isLogin ? "Logging in..." : "Signing Up...",
    });

    loadingEl.present();
    let authObs: Observable<AuthResponseData>;
    if (this.isLogin) {
      authObs = this.authService.login(form.value.email, form.value.password);
    } else {
      authObs = this.authService.signup(
        form.value.name,
        form.value.email,
        form.value.password
      );
    }
    authObs.subscribe(
      (response) => {
        loadingEl.dismiss();
        this.router.navigateByUrl("/");
        this.showToast(response.message, "success");
        form.reset();
      },
      (error) => {
        loadingEl.dismiss();
        let msg = "Cannot authenticate. Please try again later.";
        if (error.error) {
          if (error.error.message) {
            msg = error.error.message;
          }
        }
        this.showToast(error.error.message, "danger");
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
