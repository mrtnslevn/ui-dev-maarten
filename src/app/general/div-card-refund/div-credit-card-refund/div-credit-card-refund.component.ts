import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators } from '@angular/forms';
import { BankList } from '../../models/BankList';
import { CreditCardRefund } from '../../models/div-card-refund/CreditCardRefund';
import { CreditCardRefundValidationFormsService } from './validation-forms.service';

@Component({
  selector: 'app-div-credit-card-refund',
  templateUrl: './div-credit-card-refund.component.html',
  styleUrls: ['./div-credit-card-refund.component.scss']
})
export class DivCreditCardRefundComponent implements OnInit {
  public _readOnly: boolean = false;
  @Input() set readOnly(readOnly: boolean) {
    this._readOnly = readOnly;

    if (!this._readOnly) {
      this.formRequired();
      return;
    }
    this.clearForm();
  }

  merchantList: BankList[] = []
  @Input() data: CreditCardRefund = CreditCardRefund.default()
  @Output() dataChange = new EventEmitter<CreditCardRefund>();

  @Input() formValid: boolean = false;
  @Output() formValidChange = new EventEmitter<boolean>();

  constructor(public vf: CreditCardRefundValidationFormsService) { 
    this.vf.component = this;
    this.vf.createForm()
  }

  ngOnInit(): void {
  }

  formRequired() {
    for (const name in this.vf.f) {
      this.vf.f[name].addValidators([Validators.required]);
      this.vf.f[name].updateValueAndValidity();
    }
  }

  clearForm() {
    for (const name in this.vf.f) {
      this.vf.f[name].setValue("");
      this.vf.f[name].removeValidators([Validators.required]);
      this.vf.f[name].updateValueAndValidity();
    }
  }

  onChangeCardNo(e:any){
    this.data.card_no = e

    this.updateData()
    this.updateValidity()
  }

  onChangeCardHolderName(e: any){
    this.data.card_holder_name = e

    this.updateData()
    this.updateValidity()
  }

  onChangeReferenceNo(e: any){
    this.data.reference_no = e

    this.updateData()
    this.updateValidity()
  }

  onChangeApprovalCode(e: any){
    this.data.approval_code = e

    this.updateData()
    this.updateValidity()
  }
  
  onChangeMerchantId(e: any){
    this.data.merchant_id = e

    this.updateData()
    this.updateValidity()
  }

  updateData() {
    this.dataChange.emit(this.data);
  }

  updateValidity() {
    this.formValid = this.vf.form.valid;
    this.formValidChange.emit(this.formValid);
  }

}
