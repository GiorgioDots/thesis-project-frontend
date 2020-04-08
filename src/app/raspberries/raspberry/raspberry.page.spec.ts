import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { RaspberryPage } from './raspberry.page';

describe('RaspberryPage', () => {
  let component: RaspberryPage;
  let fixture: ComponentFixture<RaspberryPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RaspberryPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(RaspberryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
