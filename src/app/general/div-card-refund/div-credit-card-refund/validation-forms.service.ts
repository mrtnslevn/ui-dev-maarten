import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DivCreditCardRefundComponent } from './div-credit-card-refund.component';

@Injectable({
  providedIn: 'root'
})
export class CreditCardRefundValidationFormsService {
  component!: DivCreditCardRefundComponent
  errorMessages: any;
  submitted: boolean = false

  form!: FormGroup;
  formErrors: any;

  formRules = {
    numberOnly: "^[0-9]*$",
  };

  constructor(private fb: FormBuilder,) {
    this.errorMessages = {
      cardNo: {
        required: 'Card number is required',
      },
      referenceNo: {
        required: 'Reference number is required',
      },
      cardHolderName: {
        required: 'Card holder name is required',
      },
      approvalCode: {
        required: 'Approval code is required'
      },
      merchantId: {
        required: 'Merchant ID is required'
      }
    };
  }

  get f() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      cardNo: ['', [Validators.required]],
      cardHolderName: ['', [Validators.required]],
      referenceNo: ['', [Validators.required]],
      approvalCode: ['', [Validators.required]],
      merchantId: ['', [Validators.required]]
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
}
