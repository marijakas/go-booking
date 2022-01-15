import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationItemUserComponent } from './destination-item-user.component';

describe('DestinationItemUserComponent', () => {
  let component: DestinationItemUserComponent;
  let fixture: ComponentFixture<DestinationItemUserComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationItemUserComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationItemUserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
