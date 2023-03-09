import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DischargeListComponent } from './discharge-list.component';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class DischargeListFormsService {
  component!: DischargeListComponent;

  form!: FormGroup;
  submitted: boolean = false;

  get controls() {
    return this.form.controls;
  }

  get valid() {
    return this.form.valid;
  }

  errorMessages: any;
  formErrors: any;

  formRules = {
    numberOnly: "^[0-9]*$",
  };

  constructor(private fb: FormBuilder) {
    this.formErrors = {
      lob: {
        required: 'LOB is required', 
      },
      fromDate: {
        required: 'Discharge Date form is required', 
      },
      toDate: {
        required: 'Discharge Date to is required', 
      },
    };
  }

  createForm() {
    this.form = this.fb.group({
      lob: ['',[Validators.required]],
      admissionNo: [''],
      mrNo: [''],
      patientName: [''],
      fromDate: [this.getTodaysDate(),[Validators.required]],
      toDate: [this.getTodaysDate(),[Validators.required]],
    })
  }

  getTodaysDate() {
    return formatDate(Date.now(), "yyyy-MM-dd", "en-US")
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

  reset() {
    this.submitted = false
    this.form.reset();
    this.controls["fromDate"].setValue(this.getTodaysDate())
    this.controls["toDate"].setValue(this.getTodaysDate())
  }
}
