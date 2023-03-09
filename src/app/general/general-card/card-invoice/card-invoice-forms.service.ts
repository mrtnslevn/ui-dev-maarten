import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})
export class CardInvoiceFormsService {

  form!: FormGroup
  submitted: boolean = false

  get controls() {
    return this.form.controls
  }

  get valid() {
    return this.form.valid
  }
  
  formErrors: any = {
    limitTypePayer: {
      required: 'Limit Type is required'
    },
    limitFactorPayer: {
      required: 'Payer Limit Factor is required'
    },
    discountTypePayer: {
      required: 'Payer Discount Type is required',
    },
    discountFactorPayer: {
      required: 'Payer Discount Factor is required'
    },
    discountTypePatient :{
      required: 'Patient Discount Type is required', 
    },
    discountFactorPatient: {
      required: 'Patient Discount Factor is required'
    }
  }

  constructor(private fb: FormBuilder) { }

  createForm() {
    this.form = this.fb.group({
      limitTypePayer: ['', [Validators.required]],
      limitFactorPayer: [{ disabled: true, value: ''}, [Validators.required]],
      
      discountTypePayer: ['', [Validators.required]],
      discountFactorPayer: [{ disabled: true, value: ''}, [Validators.required]],

      discountTypePatient: ["", [Validators.required]],
      discountFactorPatient: [{ disabled: true, value: ''}, [Validators.required]],
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
    this.submitted = false
    this.form.reset({
      limitTypePayer: "", 
      limitFactorPayer: "", 
      discountTypePayer: "", 
      discountFactorPayer: "",
      discountTypePatient: "",
      discountFactorPatient: ""
    });
  }
}
