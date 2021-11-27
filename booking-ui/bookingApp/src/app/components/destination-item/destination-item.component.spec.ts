import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationItemComponent } from './destination-item.component';

describe('DestinationItemComponent', () => {
  let component: DestinationItemComponent;
  let fixture: ComponentFixture<DestinationItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationItemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
