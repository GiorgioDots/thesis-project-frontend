import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RaspberryPage } from './raspberry.page';

const routes: Routes = [
  {
    path: '',
    component: RaspberryPage
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit-raspberry/edit-raspberry.module').then( m => m.EditRaspberryPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RaspberryPageRoutingModule {}
