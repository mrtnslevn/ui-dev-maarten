import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RefundInquiryPrepaidDetailComponent } from './refund-inquiry-prepaid-detail.component';

describe('RefundInquiryPrepaidDetailComponent', () => {
  let component: RefundInquiryPrepaidDetailComponent;
  let fixture: ComponentFixture<RefundInquiryPrepaidDetailComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RefundInquiryPrepaidDetailComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RefundInquiryPrepaidDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
