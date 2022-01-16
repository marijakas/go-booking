import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationsAllComponent } from './reservations-all.component';

describe('ReservationsAllComponent', () => {
  let component: ReservationsAllComponent;
  let fixture: ComponentFixture<ReservationsAllComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReservationsAllComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReservationsAllComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
