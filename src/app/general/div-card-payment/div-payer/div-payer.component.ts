import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalExtraLargeConfig } from 'src/app/_configs/modal-config';
import { ModalSearchPayerComponent } from '../../general-modal/modal-search-payer/modal-search-payer.component';
import { Payer } from "../../models/div-card-payment/Payer";
import { Patient } from '../../models/Patient';
import { PayerValidationFormsService } from './validation-forms.service';

@Component({
  selector: 'app-div-payer',
  templateUrl: './div-payer.component.html',
  styleUrls: ['./div-payer.component.scss']
})
export class DivPayerComponent implements OnInit {

  public _readOnly: boolean = false;
  @Input() set readOnly(readOnly: boolean) {
    this._readOnly = readOnly;
    if (!this._readOnly) {
      this.formRequired();
      return;
    } 

    this.clearForm();
  }
  @Input() notes: string = "";

  @Input() data: Payer = Payer.default();
  @Output() dataChange = new EventEmitter<Payer>();

  @Input() submitted: boolean = false;
  
  @Input() formValid: boolean = false;
  @Output() formValidChange = new EventEmitter<boolean>();

  form!: FormGroup;
  formErrors: any;

  bsModalRef?: BsModalRef;

  excludeForm: string[] = ['notes']

  constructor(private fb: FormBuilder, private vf: PayerValidationFormsService,
    public bsModalService: BsModalService) {
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
      payer: ['', []],
      payerIdNo: ['', []],
      eligibilityNo: ['', []],
      notes: ['', []]
    })
  }

  formRequired() {
    for (const name in this.f) {
      if (!this.excludeForm.includes(name)) {
        this.f[name].addValidators([Validators.required]);
        this.f[name].updateValueAndValidity();
      }
    }
  }

  clearForm() {
    for (const name in this.f) {
      this.f[name].removeValidators([Validators.required]);
      this.f[name].setValue("");
      this.f[name].updateValueAndValidity();
    }
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

  openModalSearchPayer(){
    this.bsModalRef = this.bsModalService.show(ModalSearchPayerComponent, ModalExtraLargeConfig);
    // get event from modal
    this.bsModalRef.content.newItemEvent.subscribe((patient: Patient | any) => {
      this.data.payer_id = patient.payer_id;
      this.data.payer_name = patient.payer_name;

      this.f["payer"].setValue(patient.payer_name);
      this.f["payer"].updateValueAndValidity();

      this.updateValidity();
    })
  }

  onChangePayerIdNo(payerIdNo: string) {
    this.data.payer_id_no = payerIdNo;
    this.updateValidity();
  }

  onChangeEligibilityNo(eligibilityNo: string) {
    this.data.eligibility_no = eligibilityNo;
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

}
