import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentComponent } from './payment.component';
import { formatDate } from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class PaymentSearchAdmissionFormsService {
  component!: PaymentComponent;

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
    },
    lob: {
      required: 'Lob is required'
    },
    admissionSubType: {
      required: 'Admission Sub Type is required', 
    },
    admissionDateFrom: {
      required: 'Admission Date From is required'
    },
    admissionDateTo: {
      required: 'Admission Date To is required'
    }
  }

  formRules = {
    numberOnly: "^[0-9]*$",
  };

  constructor(private fb: FormBuilder) { }

  createForm() {
    this.submitted = false
    this.form = this.fb.group({
      lob: ['', [Validators.required]],
      admissionNo: [''],
      admissionSubType: [this.component.selectedAdmissionSubType, []],
      admissionDateFrom: [this.getTodaysDate(), [Validators.required]],
      admissionDateTo: [this.getTodaysDate(), [Validators.required]],
      mrNo: ['', [Validators.pattern(this.formRules.numberOnly), Validators.required]],
      patientName: [''],
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

  updateValidatorWhenAdmissionNoChange() {
    let admissionNo: string = this.controls["admissionNo"].value
    if (admissionNo == "" || admissionNo == null) {
      this.controls["lob"].addValidators(Validators.required)
      this.controls["lob"].updateValueAndValidity()

      this.controls["admissionDateFrom"].addValidators(Validators.required)
      this.controls["admissionDateFrom"].updateValueAndValidity()

      this.controls["admissionDateTo"].addValidators(Validators.required)
      this.controls["admissionDateTo"].updateValueAndValidity()

      this.controls["mrNo"].addValidators(Validators.required)
      this.controls["mrNo"].updateValueAndValidity()

      this.component.params = this.component.params.set("admission_date_to", this.component.admissionDateTo)
      this.component.params = this.component.params.set("admission_date_from", this.component.admissionDateFrom)
    } else {
      this.controls["lob"].removeValidators(Validators.required)
      this.controls["lob"].updateValueAndValidity()

      this.controls["admissionDateFrom"].removeValidators(Validators.required)
      this.controls["admissionDateFrom"].updateValueAndValidity()

      this.controls["admissionDateTo"].removeValidators(Validators.required)
      this.controls["admissionDateTo"].updateValueAndValidity()

      this.controls["mrNo"].removeValidators(Validators.required)
      this.controls["mrNo"].updateValueAndValidity()

      this.component.params = this.component.params.delete("admission_date_to")
      this.component.params = this.component.params.delete("admission_date_from")
    }
  }

  reset() {
    this.form.reset({admissionNo: "", lob: ""})

    this.controls["admissionDateFrom"].setValue(this.getTodaysDate())
    this.controls["admissionDateFrom"].updateValueAndValidity()

    this.controls["admissionDateTo"].setValue(this.getTodaysDate())
    this.controls["admissionDateTo"].updateValueAndValidity()
  }
}
