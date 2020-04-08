import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRaspberryPageRoutingModule } from './edit-raspberry-routing.module';

import { EditRaspberryPage } from './edit-raspberry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EditRaspberryPageRoutingModule
  ],
  declarations: [EditRaspberryPage]
})
export class EditRaspberryPageModule {}
