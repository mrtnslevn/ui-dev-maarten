import { Injectable } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { InvoiceListDetailComponent } from './invoice-list-detail.component';


@Injectable({
  providedIn: 'root'
})
export class InvoiceListDetailFormsService {
  component!: InvoiceListDetailComponent;

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
      amount: ['', 
        [
          Validators.required,
          (control: AbstractControl) => Validators.max(this.component.payment.balance)(control)
        ]],
      paymentMode: ['', [Validators.required]]
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
