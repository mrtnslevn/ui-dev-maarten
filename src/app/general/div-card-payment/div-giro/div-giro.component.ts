import { HttpParams } from '@angular/common/http';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { Bank } from '../../models/div-card-payment/Bank';
import {Giro} from "../../models/div-card-payment/Giro";
import { GetListResponse } from '../../models/response/GetListResponse';
import { GiroValidationFormsService } from './validation-forms.service';

@Component({
  selector: 'app-div-giro',
  templateUrl: './div-giro.component.html',
  styleUrls: ['./div-giro.component.scss']
})
export class DivGiroComponent implements OnInit {

  @Input() data: Giro = Giro.default()
  @Output() dataChange = new EventEmitter<Giro>();

  @Input() notes: string = "";

  public _readOnly: boolean = false;
  @Input() set readOnly(readOnly: boolean) {
    this._readOnly = readOnly;

   if (!this._readOnly) {
    this.formRequired();
    return;
   } 

   this.clearForm();
  }

  @Input() formValid: boolean = false;
  @Output() formValidChange = new EventEmitter<boolean>();
  @Input() submitted: boolean = false;

  form!: FormGroup;
  formErrors: any;

  getListResponse: any
  bankList: Bank[] = []
  selectedBank: Bank = Bank.default();
  
  loadCard: boolean = false
  process: boolean = false;
  progress: boolean = false;
  
  bsModalShowAlert?: BsModalRef

  constructor(private generalService: GeneralService, private fb: FormBuilder,
    private vf: GiroValidationFormsService,
    private alertService: ModalAlertService) {
    this.formErrors = this.vf.errorMessages; 
    this.createForm();
  }

  ngOnInit(): void {
    if(!this.readOnly) {
      this.getList() 
    }
  }

  getList(){
    this.loadCard = true
    const params = new HttpParams()
    .set('param_list', 'bankList')

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS) {
          this.bankList = this.getListResponse.bankList
          this.loadCard = false
        } else {
          this.loadCard = false
          this.alertService.showModalAlert(`Failed to get bank list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert('An error has occured while get bank list, please contact administration',ALERT_DANGER)
      });
  }

  createForm() {
    this.form = this.fb.group({
      bank_id: ['',[]],
      cheque_no: ['', []],
      cheque_date: ['', []],
      notes: ['', []]
    })
  }

  formRequired() {
    this.f["bank_id"].addValidators([Validators.required]);
    this.f["bank_id"].updateValueAndValidity();
    this.f["cheque_no"].addValidators([Validators.required]);
    this.f["cheque_no"].updateValueAndValidity();
    this.f["cheque_date"].addValidators([Validators.required]);
    this.f["cheque_date"].updateValueAndValidity();
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
    return (this.submitted || this.process) && this.f[formName].errors;
  }

  isFormValid(formName: string) {
    return { 'is-invalid': (this.submitted || this.process) && this.f[formName].errors, 
              'is-valid': (this.submitted || this.process) && !this.f[formName].errors }
  }

  getErrors(formName: string): any {
    return this.f[formName].errors;
  }

  getErrorMessage(formName: string, error: any): string {
    return this.formErrors[formName][error];
  }

  updateValidity() {
    this.formValid = this.form.valid;
    this.formValidChange.emit(this.formValid);
    this.dataChange.emit(this.data);
  }

  onChangeBank(selected: any){
    if (selected == null) selected = Bank.default();
    this.selectedBank = selected;
    this.data.bank_id = parseInt(this.selectedBank.key);
    this.data.bank_name = this.selectedBank.value;
    this.updateValidity();
  }

  onChangeNotes(notes: string) {
    this.data.notes = notes;
  }

  onChangeChequeNumber(number: string) {
    this.data.cheque_no = number;
    this.updateValidity()
  }

  onChangeChequeDates(date: string) {
    this.data.cheque_date = date;
    this.updateValidity()
  }


}
