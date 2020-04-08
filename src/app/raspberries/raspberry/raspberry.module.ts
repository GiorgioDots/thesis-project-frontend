import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RaspberryPageRoutingModule } from './raspberry-routing.module';

import { RaspberryPage } from './raspberry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RaspberryPageRoutingModule
  ],
  declarations: [RaspberryPage]
})
export class RaspberryPageModule {}
