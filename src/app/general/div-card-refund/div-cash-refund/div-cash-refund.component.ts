import { DecimalPipe } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { CashRefund } from '../../models/div-card-refund/CashRefund';
import { IdentityType } from '../../models/IdentityType';
import { GetListResponse } from '../../models/response/GetListResponse';
import { CashRefundValidationFormsService } from './validation-forms.service';

@Component({
  selector: 'app-div-cash-refund',
  templateUrl: './div-cash-refund.component.html',
  styleUrls: ['./div-cash-refund.component.scss']
})
export class DivCashRefundComponent implements OnInit {
  loadPage: boolean = false
  public _readOnly: boolean = false;
  @Input() set readOnly(readOnly: boolean) {
    this._readOnly = readOnly;

    if (!this._readOnly) {
      this.formRequired();
      return;
    }
    this.clearForm();
  }

  @Input() submitted: boolean = false;

  @Input() data: CashRefund = CashRefund.default()
  @Output() dataChange = new EventEmitter<CashRefund>();

  formErrors: any;

  getListResponse!: GetListResponse
  receivedBy: string = ''
  identityTypeList: IdentityType[] = []
  selectedIdentityType: IdentityType = IdentityType.default()
  identityNo: string = ''
  handphone: string = ''

  @Input() formValid: boolean = false;
  @Output() formValidChange = new EventEmitter<boolean>();

  constructor( 
    public vf: CashRefundValidationFormsService, 
    private decimalPipe: DecimalPipe,
    private generalService: GeneralService,
    private alertService: ModalAlertService) { 
    this.formErrors = this.vf.errorMessages;
    this.vf.createForm();
  }

  ngOnInit(): void {
    this.getList()
  }

  getList(){
    this.loadPage = true
    const params = new HttpParams()
    .set('param_list', 'nationalityIdTypeList')

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.identityTypeList = this.getListResponse.nationalityIdTypeList
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

  onChangeReceivedBy(e: any){
    this.receivedBy = e
    this.data.received_by = this.receivedBy

    this.updateValidity()
    this.updateData()
  }

  onChangeIdentityType(e: any){
    this.selectedIdentityType = e
    this.data.identity_type_id = Number(this.selectedIdentityType.key)

    this.updateValidity()
    this.updateData()
  }

  onChangeIdentityNo(e: any){
    this.identityNo = e
    this.data.identity_no = this.identityNo

    this.updateValidity()
    this.updateData()
  }

  onChangeHandphone(e: any){
    this.handphone = e
    this.data.phone_no = this.handphone

    this.updateValidity()
    this.updateData()
  }

  updateData() {
    this.dataChange.emit(this.data);
  }

  updateValidity() {
    this.formValid = this.vf.form.valid;
    this.formValidChange.emit(this.formValid);
  }

}
