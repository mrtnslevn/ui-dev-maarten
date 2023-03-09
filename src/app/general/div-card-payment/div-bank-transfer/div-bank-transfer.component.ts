import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { BankAccountList } from '../../models/BankAccountList';
import { BankList } from '../../models/BankList';
import { Bank_Transfer } from "../../models/div-card-payment/Bank_Transfer";
import { GetListResponse } from '../../models/response/GetListResponse';
import { BankTransferValidationFormsService } from './validation-forms.service';

@Component({
  selector: 'app-div-bank-transfer',
  templateUrl: './div-bank-transfer.component.html',
  styleUrls: ['./div-bank-transfer.component.scss']
})
export class DivBankTransferComponent implements OnInit {

  public _readOnly: boolean = false;
  @Input() set readOnly(readOnly: boolean) {
    this._readOnly = readOnly;

    if (!this._readOnly) {
     this.formRequired();
     return;
    } 
 
    this.clearForm();
  }
  @Input() notes: string = '';

  @Input() data: Bank_Transfer = Bank_Transfer.default();
  @Output() dataChange = new EventEmitter<Bank_Transfer>();

  @Input() submitted: boolean = false;
 
  @Input() formValid: boolean = false;
  @Output() formValidChange = new EventEmitter<boolean>();

  form!: FormGroup;
  formErrors: any;

  getListResponse: GetListResponse | undefined;
  loadPage: boolean = false;
  bankList: BankList[] = [];
  receiptBankList: BankAccountList[] = [];

  bsModalShowAlert?: BsModalRef

  constructor(private fb: FormBuilder, private vf: BankTransferValidationFormsService,
    private generalService: GeneralService, private bsModalService : BsModalService,
    private alertService: ModalAlertService) {
    this.formErrors = this.vf.errorMessages;
    this.createForm();
  }

  ngOnInit(): void {
    this.getList();
  }

  createForm() {
    this.form = this.fb.group({
      bank: ['', []],
      accountNo: ['', []],
      accountName: ['', []],
      transferDate: ['', []],
      referenceNo: ['', []],
      receiptBankAcc: ['', []],
      notes: ['', []],
    })
  }

  formRequired() {
    this.f["bank"].addValidators([Validators.required]);
    this.f["bank"].updateValueAndValidity();
    this.f["accountNo"].addValidators([Validators.required]);
    this.f["accountNo"].updateValueAndValidity();
    this.f["accountName"].addValidators([Validators.required]);
    this.f["accountName"].updateValueAndValidity();
    this.f["transferDate"].addValidators([Validators.required]);
    this.f["transferDate"].updateValueAndValidity();
    this.f["referenceNo"].addValidators([Validators.required]);
    this.f["referenceNo"].updateValueAndValidity();
    this.f["receiptBankAcc"].addValidators([Validators.required]);
    this.f["receiptBankAcc"].updateValueAndValidity();
  }

  clearForm() {
    for (const name in this.f) {
      this.f[name].removeValidators([Validators.required]);
      this.f[name].setValue("");
      this.f[name].updateValueAndValidity();
    }
  }

  get f() {
    return this.form.controls;
  }

  isFormError(formName: string) {
    return this.submitted && this.f[formName].errors;
  }

  isFormValid(formName: string) {
    return { 'is-invalid': this.submitted && this.f[formName].errors, 
              'is-valid': this.submitted && !this.f[formName].errors }
  }

  getErrors(formName: string): any {
    return this.f[formName].errors;
  }

  getErrorMessage(formName: string, error: any): string {
    return this.formErrors[formName][error];
  }

  onChangeBank(selected: BankList) {
    this.data.bank_id = Number(selected.key);
    this.data.bank_name = selected.value;
    this.updateValidity();
  }

  onChangeAccountNo(accountNo: string) {
    this.data.account_no = accountNo;
    this.updateValidity();
  }

  onChangeAccountName(accountName: string) {
    this.data.account_name = accountName;
    this.updateValidity();
  }

  onChangeTransferDate(transferDate: string) {
    this.data.transfer_date = transferDate;
    this.updateValidity();
  }

  onChangeReferenceNo(referenceNo: string) {
    this.data.reference_no = referenceNo;
    this.updateValidity();
  }

  onChangeReceiptBankAcc(selected: BankAccountList) {
    this.data.receipt_bank_acc_id = Number(selected.key);
    this.data.receipt_bank_acc_name = selected.value;
    this.updateValidity();
  }

  onChangeNotes(notes: string) {
    this.data.notes = notes;
    this.updateValidity();
  }

  updateValidity() {
    this.formValid = this.form.valid;
    this.formValidChange.emit(this.formValid);
    this.dataChange.emit(this.data);
  }

  getList() {
    this.loadPage = true;
    const params = new HttpParams().set('param_list', 'bankList')
    .append("param_list", "bankAccountList");

    this.generalService.getListWithParam(params)
    .subscribe((data: GetListResponse) => {
      this.getListResponse = {...data};
      if (this.getListResponse.response_code == RESPONSE_SUCCESS) {
        this.bankList = this.getListResponse.bankList;
        this.receiptBankList = this.getListResponse.bankAccountList;
      } else {
        this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadPage = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
      this.loadPage = false;
    })
  }

}
