import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { RaspberriesPage } from "./raspberries.page";

const routes: Routes = [
  {
    path: "",
    component: RaspberriesPage,
  },
  {
    path: ":raspiId",
    loadChildren: () =>
      import("./raspberry/raspberry.module").then((m) => m.RaspberryPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaspberriesPageRoutingModule {}
