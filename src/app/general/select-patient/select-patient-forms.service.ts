import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SelectPatientComponent } from './select-patient.component';

@Injectable({
  providedIn: 'root'
})
export class SelectPatientFormsService {

  component!: SelectPatientComponent

  form!: FormGroup;
  submitted: boolean = false;

  get controls() {
    return this.form.controls;
  }

  get valid() {
    return this.form.valid;
  }

  formErrors: any = {
    mrNo: {
      required: 'Mr. No is required',
      pattern: 'Mr. No must be number'
    }
  }

  formRules = {
    numberOnly: "^[0-9]*$",
  };

  constructor(private fb: FormBuilder) { }

  createForm() {
    this.form = this.fb.group({
      mrNo: ['', [Validators.required, Validators.pattern(this.formRules.numberOnly)]],
      dob: [''],
      idNo: [''],
      patientName: ['']
    })
  }

  isFormValid(formControlName: string) {
    return { 'is-invalid': this.submitted && this.controls[formControlName].errors, 
              'is-valid': this.submitted && !this.controls[formControlName].errors }
  }

  isFormError(formControlName: string) {
    return this.submitted && this.controls[formControlName].errors;
  }

  getFormErrors(formControlName: string): any {
    return this.controls[formControlName].errors;
  }

  getFormErrorMessage(formControlName: string, error: any): string {
    return this.formErrors[formControlName][error];
  }

  updateValidatorWhenAdmissionNoChange() {
    if (this.component.formRequired) {
      this.controls["mrNo"].addValidators(Validators.required)
      this.controls["mrNo"].updateValueAndValidity()
    } else {
      this.controls["mrNo"].removeValidators(Validators.required)
      this.controls["mrNo"].updateValueAndValidity()
    }
    this.component.formValid = this.form.valid
    this.component.formValidChange.emit(this.form.valid)
  }

  reset() {
    this.form.reset();
  }
}
