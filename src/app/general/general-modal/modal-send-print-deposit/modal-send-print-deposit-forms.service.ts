import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ModalSendPrintDepositComponent } from './modal-send-print-deposit.component';

@Injectable({
  providedIn: 'root'
})
export class ModalSendPrintDepositFormsService {
  component!: ModalSendPrintDepositComponent

  form!: FormGroup
  submitted: boolean = false

  get controls() {
    return this.form.controls
  }

  get valid() {
    return this.form.valid
  }

  formErrors: any = {
    action: {
      required: 'Action is required',
    },
    // whatsapp:{
    //   required: 'Whatsapp No. is required', 
    // },
    email: {
      required: 'Email is required'
    }
  }

  constructor(private fb: FormBuilder) { }

  createForm() {
    this.form = this.fb.group({
      action: ['', [Validators.required]],
      whatsapp: [this.component.whatsapp],
      email: [this.component.email, [Validators.required]]
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
