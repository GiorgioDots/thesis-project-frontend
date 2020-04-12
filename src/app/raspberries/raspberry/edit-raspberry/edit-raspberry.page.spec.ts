import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { EditRaspberryPage } from './edit-raspberry.page';

describe('EditRaspberryPage', () => {
  let component: EditRaspberryPage;
  let fixture: ComponentFixture<EditRaspberryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditRaspberryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(EditRaspberryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
