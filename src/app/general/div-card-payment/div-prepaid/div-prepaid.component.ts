import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { PrepaidService } from 'src/app/service/prepaid.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { Prepaid } from "../../models/div-card-payment/Prepaid";
import { Patient } from '../../models/Patient';
import { GetPrepaidListByMrNoResponse } from '../../models/response/GetPrepaidListByMrNoResponse';
import { PrepaidValidationFormsService } from './validation-forms.service';

@Component({
  selector: 'app-div-prepaid',
  templateUrl: './div-prepaid.component.html',
  styleUrls: ['./div-prepaid.component.scss']
})
export class DivPrepaidComponent implements OnInit {

  public _readOnly: boolean = false;
  @Input() set readOnly(readOnly: boolean) {
    this._readOnly = readOnly;
    if (!this._readOnly) {
      this.formRequired();
      return;
    } 

    this.clearForm();
  }

  @Input() data: Prepaid = Prepaid.default();
  @Output() dataChange = new EventEmitter<Prepaid>();

  private _patientInfo: Patient = Patient.default();
  @Input() set patientInfo(value: Patient) {
    this._patientInfo = value;
    if (this._patientInfo.mr_no != undefined && this._patientInfo.mr_no! > 0) this.getPrepaidList();
  }

  @Input() submitted: boolean = false;
  
  @Input() formValid: boolean = false;
  @Output() formValidChange = new EventEmitter<boolean>();

  form!: FormGroup;
  formErrors: any;
  
  prepaidList: Prepaid[] = [];

  getPrepaidListByMrNoResponse: GetPrepaidListByMrNoResponse | undefined;

  excludeForm: string[] = ['notes'];
  loadPage: boolean = false;
  bsModalShowAlert?: BsModalRef

  constructor(private fb: FormBuilder, private vf: PrepaidValidationFormsService,
    private prepaidService: PrepaidService, private alertService: ModalAlertService) {
      this.formErrors = this.vf.errorMessages;
      this.createForm();
  }

  ngOnInit(): void {
  }

  get f() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      bookingId: [{value: '', disabled: true}, [Validators.required]],
      orderId: ['', []],
      acquiringBank: ['', []],
      bankNo: ['', []],
      cardAssoc: ['', []],
      cardNo: ['', []],
      customer: ['', []],
      notes: ['', []],
      paymentMode: ['', []],
      amount: ['', []],
    })
  }

  formRequired() {
    this.f["bookingId"].enable()
  }

  clearForm() {
    this.f["bookingId"].disable()
    this.form.reset({
      orderId: '',
      acquiringBank: '',
      bankNo: '',
      cardAssoc: '',
      cardNo: '',
      customer: '',
      notes: '',
      paymentMode: '',
      amount: '',
    })
  }

  isFormValid(formName: string) {
    return { 'is-invalid': this.submitted && this.f[formName].errors, 
              'is-valid': this.submitted && !this.f[formName].errors }
  }

  isFormError(formName: string) {
    return this.submitted && this.f[formName].errors;
  }

  getErrors(formName: string): any {
    return this.f[formName].errors;
  }

  getErrorMessage(formName: string, error: any): string {
    return this.formErrors[formName][error];
  }

  onChangeBookingId(selected: Prepaid) {
    PropertyCopier.copyProperties(selected, this.data);
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

  getPrepaidList() {
    this.loadPage = true;
    const params = new HttpParams().set("mr_no", this._patientInfo.mr_no!);
    this.prepaidService.getPrepaidListByMrNo(params)
    .subscribe((data: GetPrepaidListByMrNoResponse) => {
      this.getPrepaidListByMrNoResponse = {...data};
      if (this.getPrepaidListByMrNoResponse.response_code == RESPONSE_SUCCESS) {
        this.prepaidList = this.getPrepaidListByMrNoResponse.prepaid_list;
      } else {
        this.alertService.showModalAlert(`Failed to get prepaid list: ${this.getPrepaidListByMrNoResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadPage = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get prepaid list, please contact administration`, ALERT_DANGER)
      this.loadPage = false;
    })
  }

}
