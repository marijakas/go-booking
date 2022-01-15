import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationUserComponent } from './destination-user.component';

describe('DestinationUserComponent', () => {
  let component: DestinationUserComponent;
  let fixture: ComponentFixture<DestinationUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
