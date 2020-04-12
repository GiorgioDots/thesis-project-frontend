import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { IonicModule } from "@ionic/angular";

import { PeoplePageRoutingModule } from "./people-routing.module";

import { PeoplePage } from "./people.page";
import { AddPersonComponent } from "./add-person/add-person.component";
import { ImagePickerComponent } from "../shared/image-picker/image-picker.component";

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ReactiveFormsModule,
    PeoplePageRoutingModule,
  ],
  declarations: [PeoplePage, AddPersonComponent, ImagePickerComponent],
  entryComponents: [AddPersonComponent],
})
export class PeoplePageModule {}
