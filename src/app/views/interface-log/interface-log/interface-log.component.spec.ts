import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InterfaceLogComponent } from './interface-log.component';

describe('InterfaceLogComponent', () => {
  let component: InterfaceLogComponent;
  let fixture: ComponentFixture<InterfaceLogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ InterfaceLogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InterfaceLogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
