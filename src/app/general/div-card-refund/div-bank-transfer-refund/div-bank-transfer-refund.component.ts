import { DecimalPipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Validators } from '@angular/forms';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { BankAccountList } from '../../models/BankAccountList';
import { BankList } from '../../models/BankList';
import { BankTransferRefund } from '../../models/div-card-refund/BankTransferRefund';
import { GetListResponse } from '../../models/response/GetListResponse';
import { BankTransferRefundValidationFormsService } from './validation-forms.service';

@Component({
  selector: 'app-div-bank-transfer-refund',
  templateUrl: './div-bank-transfer-refund.component.html',
  styleUrls: ['./div-bank-transfer-refund.component.scss']
})
export class DivBankTransferRefundComponent implements OnInit {
  public _readOnly: boolean = false;
  @Input() set readOnly(readOnly: boolean) {
    this._readOnly = readOnly;

    if (!this._readOnly) {
      this.formRequired();
      return;
    }
    this.clearForm();
  }

  @Input() data: BankTransferRefund = BankTransferRefund.default()
  @Output() dataChange = new EventEmitter<BankTransferRefund>();

  loadPage: boolean = false;
  getListResponse!: GetListResponse
  bankList: BankList[] = [];
  selectedBank: BankList = BankList.default()
  refundSourceAccountList: BankAccountList[] = []

  @Input() formValid: boolean = false;
  @Output() formValidChange = new EventEmitter<boolean>();

  constructor(
    public vf: BankTransferRefundValidationFormsService, 
    private decimalPipe: DecimalPipe,
    private generalService: GeneralService,
    private alertService: ModalAlertService
  ) { 
    this.vf.component = this;
    this.vf.createForm()
  }

  ngOnInit(): void {
    this.getList()
  }

  getList(){
    this.loadPage = true
    const params = new HttpParams()
    .set('param_list', 'bankList')
    .append('param_list', 'bankAccountList')

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.bankList = this.getListResponse.bankList
          this.refundSourceAccountList = this.getListResponse.bankAccountList
        }else{
          this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
        }
        this.loadPage = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
        this.loadPage = false
      });
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

  onChangeBank(e:any){
    this.selectedBank = e
    this.data.bank_id = Number(this.selectedBank.key)

    this.updateData()
    this.updateValidity()
  }

  onChangeAccountNo(e: any){
    this.data.bene_account_no = e

    this.updateData()
    this.updateValidity()
  }
  onChangeAccountName(e: any){
    this.data.bene_account_name = e

    this.updateData()
    this.updateValidity()
  }

  onChangeRefundSourceAcc(e: any){
    this.data.refund_source_account_id = e

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
