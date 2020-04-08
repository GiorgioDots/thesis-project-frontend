import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditRaspberryPage } from './edit-raspberry.page';

const routes: Routes = [
  {
    path: '',
    component: EditRaspberryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditRaspberryPageRoutingModule {}
