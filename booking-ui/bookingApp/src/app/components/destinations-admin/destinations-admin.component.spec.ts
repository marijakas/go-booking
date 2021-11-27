import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DestinationsAdminComponent } from './destinations-admin.component';

describe('DestinationsAdminComponent', () => {
  let component: DestinationsAdminComponent;
  let fixture: ComponentFixture<DestinationsAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DestinationsAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DestinationsAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
