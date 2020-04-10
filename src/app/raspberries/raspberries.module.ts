import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { RaspberriesPageRoutingModule } from "./raspberries-routing.module";

import { RaspberriesPage } from "./raspberries.page";
import { AddRaspberryComponent } from "./add-raspberry/add-raspberry.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    RaspberriesPageRoutingModule,
  ],
  declarations: [RaspberriesPage, AddRaspberryComponent],
  entryComponents: [AddRaspberryComponent],
})
export class RaspberriesPageModule {}
