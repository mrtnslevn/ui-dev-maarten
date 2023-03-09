import { Component, OnInit } from '@angular/core';
import { Bank_Transfer } from 'src/app/general/models/div-card-payment/Bank_Transfer';
import { Cash } from 'src/app/general/models/div-card-payment/Cash';
import { Digital_Payment } from 'src/app/general/models/div-card-payment/Digital_Payment';
import { Edc } from 'src/app/general/models/div-card-payment/Edc';
import { Payment } from 'src/app/general/models/Payment';
import { PaymentMode, PaymentModePayment } from 'src/app/general/models/PaymentMode';
import { RefundRevisionPrepaidFormsComponent } from './refund-revision-prepaid-forms.service';

@Component({
  selector: 'app-refund-revision-prepaid',
  templateUrl: './refund-revision-prepaid.component.html',
  styleUrls: ['./refund-revision-prepaid.component.scss']
})
export class RefundRevisionPrepaidComponent implements OnInit {
  loadPage: boolean = false

  public payment: Payment = Payment.default()

  paymentMode: PaymentModePayment = PaymentModePayment.default();
  public paymentModeList: PaymentMode[] = []
  public selectedPaymentMode: PaymentMode = PaymentMode.default()

  formValid: PaymentModePayment = PaymentModePayment.default();

  cash: Cash = Cash.default();
  card: Edc = Edc.default();
  digitalPayment: Digital_Payment = Digital_Payment.default();
  bankTransfer: Bank_Transfer = Bank_Transfer.default();

  savePaymentProgress: boolean = false;

  constructor(public fs: RefundRevisionPrepaidFormsComponent) {
    this.fs.component = this;
   }

  ngOnInit(): void {
    this.fs.createForm();
  }

  onChangeRefundAmount(amount: any){}

  onChangePaymentMode(selection: PaymentMode) {}

  onChangeReason(selection: any) {}

  submitAddPayment(){}

}
