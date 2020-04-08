import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditPersonPage } from './edit-person.page';

describe('EditPersonPage', () => {
  let component: EditPersonPage;
  let fixture: ComponentFixture<EditPersonPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPersonPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditPersonPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
