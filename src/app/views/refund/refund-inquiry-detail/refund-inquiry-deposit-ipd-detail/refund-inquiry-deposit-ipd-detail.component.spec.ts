import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundInquiryDepositIpdDetailComponent } from './refund-inquiry-deposit-ipd-detail.component';

describe('RefundInquiryDepositIpdDetailComponent', () => {
  let component: RefundInquiryDepositIpdDetailComponent;
  let fixture: ComponentFixture<RefundInquiryDepositIpdDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundInquiryDepositIpdDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundInquiryDepositIpdDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
