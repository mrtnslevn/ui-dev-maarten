import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DivBankTransferRefundComponent } from './div-bank-transfer-refund.component';

@Injectable({
  providedIn: 'root'
})
export class BankTransferRefundValidationFormsService {

  component!: DivBankTransferRefundComponent;
  errorMessages: any;
  submitted: boolean = false

  form!: FormGroup;
  formErrors: any;

  formRules = {
    numberOnly: "^[0-9]*$",
  };

  constructor(private fb: FormBuilder,) {
    this.errorMessages = {
      bankName: {
        required: 'Bank name is required',
      },
      accountNo: {
        required: 'Account number is required',
      },
      accountName: {
        required: 'Account name is required',
      },
      refundSourceAcc: {
        required: 'Source account is required'
      }
    };
  }

  get f() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      bankName: ['', [Validators.required]],
      accountNo: ['', [Validators.required]],
      accountName: ['', [Validators.required]],
      refundSourceAcc: ['', [Validators.required]]
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
