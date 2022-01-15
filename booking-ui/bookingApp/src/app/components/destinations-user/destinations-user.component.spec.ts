import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationsUserComponent } from './destinations-user.component';

describe('DestinationsUserComponent', () => {
  let component: DestinationsUserComponent;
  let fixture: ComponentFixture<DestinationsUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationsUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationsUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
