import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { formatDate } from '@angular/common';
import { RequestRefundComponent } from './request-refund.component';

@Injectable({
  providedIn: 'root'
})
export class RequestRefundPrepaidFormsService {
  component!: RequestRefundComponent;

  formPrepaid!: FormGroup;
  submitted: boolean = false;

  get controls() {
    return this.formPrepaid.controls;
  }

  get valid() {
    return this.formPrepaid.valid;
  }

  errorMessages: any;
  formErrors: any;

  formRules = {
    numberOnly: "^[0-9]*$",
  };

  constructor(private fb: FormBuilder) {
    this.formErrors = {
      dob: {
        required: 'Date of Birth is required', 
      },
      patientName: {
        required: 'Patient Name is required', 
      },
    };
  }

  createForm() {
    this.formPrepaid = this.fb.group({
      dob: ['',[Validators.required]],
      patientName: ['',[Validators.required]],
      mrNo: [''],
      bookingId: ['']
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
    this.formPrepaid.reset();
  }
}
