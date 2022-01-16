import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsUserComponent } from './reservations-user.component';

describe('ReservationsUserComponent', () => {
  let component: ReservationsUserComponent;
  let fixture: ComponentFixture<ReservationsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
