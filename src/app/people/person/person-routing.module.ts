import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PersonPage } from './person.page';

const routes: Routes = [
  {
    path: '',
    component: PersonPage
  },
  {
    path: 'edit',
    loadChildren: () => import('./edit-person/edit-person.module').then( m => m.EditPersonPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PersonPageRoutingModule {}
