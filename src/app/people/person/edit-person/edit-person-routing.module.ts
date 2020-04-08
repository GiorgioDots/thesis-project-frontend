import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EditPersonPage } from './edit-person.page';

const routes: Routes = [
  {
    path: '',
    component: EditPersonPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EditPersonPageRoutingModule {}
