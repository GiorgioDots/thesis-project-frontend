import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { PeoplePage } from "./people.page";

const routes: Routes = [
  {
    path: "",
    component: PeoplePage,
  },
  {
    path: ":personId",
    loadChildren: () =>
      import("./person/person.module").then((m) => m.PersonPageModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PeoplePageRoutingModule {}
