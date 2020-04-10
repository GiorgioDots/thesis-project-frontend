import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EditRaspberryPageRoutingModule } from './edit-raspberry-routing.module';

import { EditRaspberryPage } from './edit-raspberry.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    EditRaspberryPageRoutingModule
  ],
  declarations: [EditRaspberryPage]
})
export class EditRaspberryPageModule {}
