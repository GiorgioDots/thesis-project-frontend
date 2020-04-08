import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RaspberriesPage } from './raspberries.page';

describe('RaspberriesPage', () => {
  let component: RaspberriesPage;
  let fixture: ComponentFixture<RaspberriesPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaspberriesPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RaspberriesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
