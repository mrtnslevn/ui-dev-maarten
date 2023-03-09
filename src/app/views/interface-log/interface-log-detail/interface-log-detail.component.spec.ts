import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceLogDetailComponent } from './interface-log-detail.component';

describe('InterfaceLogDetailComponent', () => {
  let component: InterfaceLogDetailComponent;
  let fixture: ComponentFixture<InterfaceLogDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfaceLogDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceLogDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
