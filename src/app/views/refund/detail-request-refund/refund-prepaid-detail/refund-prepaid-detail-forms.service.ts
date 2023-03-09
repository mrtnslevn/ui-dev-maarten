import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RefundPrepaidDetailComponent } from './refund-prepaid-detail.component';


@Injectable({
  providedIn: 'root'
})
export class RefundPrepaidDetailFormsComponent {
  component!: RefundPrepaidDetailComponent;

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
      amount: {
        required: 'Amount is required',
        max: 'Paid amount is bigger than balance',
        pattern: 'Amount must be number'
      },
      paymentMode: {
        required: 'Payment Mode is required', 
      }
    };
  }

  createForm() {
    this.form = this.fb.group({
        openingBalance: [''],
        refundAmount: ['', [Validators.required]],
        closingBalance: [''],
        net: [''],
        paymentMode: ['', [Validators.required]],
        reason: ['', [Validators.required]],
        notes: ['']
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

  reset() {
    this.form.reset();
  }
}
