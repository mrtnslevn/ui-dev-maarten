import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CashRefundValidationFormsService {

  errorMessages: any;
  submitted: boolean = false

  form!: FormGroup;
  formErrors: any;

  formRules = {
    numberOnly: "^[0-9]*$",
  };

  constructor(private fb: FormBuilder,) {
    this.errorMessages = {
      receivedBy: {
        required: 'Name is required',
      },
      identityType: {
        required: 'Identity Type is required',
      },
      identityNo: {
        required: 'Identity Number is required',
      },
      handphone: {
        required: 'Handphone number is required'
      }
    };
  }

  get f() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      receivedBy: ['', [Validators.required]],
      identityType: ['', [Validators.required]],
      identityNo: ['', [Validators.required]],
      handphone: ['', [Validators.required]]
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
