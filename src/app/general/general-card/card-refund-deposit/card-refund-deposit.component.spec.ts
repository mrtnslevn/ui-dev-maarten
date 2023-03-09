import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CardRefundDepositComponent } from './card-refund-deposit.component';

describe('CardRefundDepositComponent', () => {
  let component: CardRefundDepositComponent;
  let fixture: ComponentFixture<CardRefundDepositComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CardRefundDepositComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CardRefundDepositComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
