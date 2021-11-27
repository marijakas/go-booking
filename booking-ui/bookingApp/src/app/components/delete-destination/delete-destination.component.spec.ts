import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDestinationComponent } from './delete-destination.component';

describe('DeleteDestinationComponent', () => {
  let component: DeleteDestinationComponent;
  let fixture: ComponentFixture<DeleteDestinationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DeleteDestinationComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DeleteDestinationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
