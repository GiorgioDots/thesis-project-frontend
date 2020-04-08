import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RaspberriesPageRoutingModule } from './raspberries-routing.module';

import { RaspberriesPage } from './raspberries.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RaspberriesPageRoutingModule
  ],
  declarations: [RaspberriesPage]
})
export class RaspberriesPageModule {}
