import { NgModule } from "@angular/core";
import { PreloadAllModules, RouterModule, Routes } from "@angular/router";
import { AuthGuard } from "./auth/auth.guard";

const routes: Routes = [
  {
    path: "",
    redirectTo: "dashboard",
    pathMatch: "full",
  },
  {
    path: "folder/:id",
    loadChildren: () =>
      import("./folder/folder.module").then((m) => m.FolderPageModule),
  },
  {
    path: "auth",
    loadChildren: () =>
      import("./auth/auth.module").then((m) => m.AuthPageModule),
  },
  {
    path: "dashboard",
    loadChildren: () =>
      import("./dashboard/dashboard.module").then((m) => m.DashboardPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: "events",
    loadChildren: () =>
      import("./events/events.module").then((m) => m.EventsPageModule),
    canLoad: [AuthGuard],
  },
  {
    path: "people",
    loadChildren: () =>
      import("./people/people.module").then((m) => m.PeoplePageModule),
    canLoad: [AuthGuard],
  },
  {
    path: "raspberries",
    loadChildren: () =>
      import("./raspberries/raspberries.module").then(
        (m) => m.RaspberriesPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: "user-settings",
    loadChildren: () =>
      import("./user-settings/user-settings.module").then(
        (m) => m.UserSettingsPageModule
      ),
    canLoad: [AuthGuard],
  },
  {
    path: "**",
    redirectTo: "/dashboard",
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
