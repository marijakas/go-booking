import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RateDestinationComponent } from './rate-destination.component';

describe('RateDestinationComponent', () => {
  let component: RateDestinationComponent;
  let fixture: ComponentFixture<RateDestinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RateDestinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RateDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
