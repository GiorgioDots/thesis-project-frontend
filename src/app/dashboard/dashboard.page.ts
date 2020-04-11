import { Component, OnInit, OnDestroy } from "@angular/core";
import { Subscription, VirtualTimeScheduler } from "rxjs";
import { Router } from "@angular/router";
import { ToastController } from "@ionic/angular";

import * as Highcharts from "highcharts";

import { Dashboard } from "./dashboard.model";
import { DashboardService } from "./dashboard.service";
import { Person } from "../people/person.model";

@Component({
  selector: "app-dashboard",
  templateUrl: "./dashboard.page.html",
  styleUrls: ["./dashboard.page.scss"],
})
export class DashboardPage implements OnInit, OnDestroy {
  /*HIGHCHARTS CONFIG*/
  private chartSeries = [];
  public Highcharts: typeof Highcharts = Highcharts;
  public chartOptions: Highcharts.Options = {
    chart: {
      type: "column",
    },
    title: {
      text: "5 Most detecte people",
    },
    xAxis: {
      categories: ["People"],
    },
    yAxis: {
      title: {
        text: "Counter",
      },
    },
    series: this.chartSeries,
  };
  public updateChart = false;
  /****/
  public selectedRaspi = null;
  public dashboard: Dashboard;
  public isLoading = false;
  public plantStatusColor;
  public selectedAction = null;
  private dashboardSub: Subscription;

  constructor(
    private dashboardService: DashboardService,
    private router: Router,
    private toastCtrl: ToastController
  ) {}

  ngOnInit() {
    this.isLoading = true;
    this.dashboardSub = this.dashboardService.dashboard.subscribe((dashbrd) => {
      if (dashbrd) {
        this.dashboard = dashbrd;
        if (this.chartSeries.length > 0) {
          this.chartSeries = [];
        }
        for (let person of this.dashboard.people) {
          this.chartSeries.push({
            type: undefined,
            name: person.name,
            data: [person.counter],
          });
        }
        this.chartOptions.series = this.chartSeries;
        this.updateChart = true;
        if (this.dashboard.plantStatus === "offline") {
          this.plantStatusColor = "danger";
        }
        if (this.dashboard.plantStatus === "partial online") {
          this.plantStatusColor = "warning";
        }
        if (this.dashboard.plantStatus === "online") {
          this.plantStatusColor = "success";
        }
        this.isLoading = false;
      }
    });
  }

  ngOnDestroy() {
    this.dashboardSub.unsubscribe();
  }

  ionViewWillEnter() {
    this.isLoading = true;
    this.dashboardService.getDashboard().subscribe(
      () => {
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        let msg = "Cannot get the dashboard. Please try again later";
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

  goToEvent(eventId) {
    this.router.navigate(["/", "events", eventId]);
  }

  onChartInstance(chart: Highcharts.Chart) {
    setTimeout(() => {
      try {
        chart.reflow();
        chart.update(this.chartOptions);
      } catch (err) {}
    }, 100);
  }

  onChangeSelectRaspi(event) {
    this.selectedRaspi = event.detail.value;
  }

  onChangeAction(event) {
    this.selectedAction = event.detail.value;
  }

  onSendAction() {
    this.isLoading = true;
    this.dashboardService.togglePlantStatus(this.selectedAction).subscribe(
      () => {
        this.showToast(
          `Plant ${this.selectedAction}d successfully.`,
          "success"
        );
        this.selectedAction = null;
        this.isLoading = false;
      },
      (error) => {
        console.log(error);
        let msg = "Cannot update the plant status. Please try again later";
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
}
