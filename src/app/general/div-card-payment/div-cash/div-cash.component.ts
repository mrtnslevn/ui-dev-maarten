import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Cash } from "../../models/div-card-payment/Cash";
import { Payment } from '../../models/Payment';
import { CashValidationFormsService } from './validation-forms.service';
import { DecimalPipe } from '@angular/common';

@Component({
  selector: 'app-div-cash',
  templateUrl: './div-cash.component.html',
  styleUrls: ['./div-cash.component.scss']
})
export class DivCashComponent implements OnInit {

  public _readOnly: boolean = false;
  @Input() set readOnly(readOnly: boolean) {
    this._readOnly = readOnly;

    if (!this._readOnly) {
      this.formRequired();
      return;
    }
    this.clearForm();
  }

  @Input() data: Cash = Cash.default();
  @Output() dataChange = new EventEmitter<Cash>();
  

  private _payment: Payment = Payment.default();
  @Input() set payment(value: Payment) {
    this._payment = value;

    let amount: string | null = this.decimalPipe.transform(this._payment.amount)
    this.f["cashAmount"].setValue(amount)
    this.f["cashAmount"].updateValueAndValidity()
    this.updateChange(this.getChange(this.data.cash_amount));
    this.updateValidity()
  }

  @Input() submitted: boolean = false;
  
  @Input() formValid: boolean = false;
  @Output() formValidChange = new EventEmitter<boolean>();

  form!: FormGroup;
  formErrors: any;

  cash: number = 0

  constructor(private fb: FormBuilder, private vf: CashValidationFormsService, private decimalPipe: DecimalPipe,) {
    this.formErrors = this.vf.errorMessages;
    this.createForm();
  }

  ngOnInit(): void {
    // this.changeCash(this.cash)
  }

  get f() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      cashAmount: ['', [
        Validators.required,
        Validators.pattern(this.vf.formRules.numberOnly),
        (control: AbstractControl) => Validators.min(this._payment.amount)(control)
      ]],
      change: ['', [Validators.pattern(this.vf.formRules.numberOnly)]]
    })
  }

  formRequired() {
    for (const name in this.f) {
      this.f[name].addValidators([Validators.required]);
      this.f[name].updateValueAndValidity();
    }
  }

  clearForm() {
    for (const name in this.f) {
      this.f[name].setValue("");
      this.f[name].removeValidators([Validators.required]);
      this.f[name].updateValueAndValidity();
    }
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

  onChangeCash(cash: number) {
    this.cash = cash
    this.changeCash(cash);
  }

  changeCash(cash: number) {
    this.data.cash_amount = cash;

    this.updateChange(this.getChange(cash));

    this.updateValidity();
    this.updateData();
  }

  getChange(cash: number) {
    let change = cash - this._payment.amount;
    if (change < 0) change = 0;
    return change;
  }

  updateChange(change: number) {
    this.data.change = change;
    this.f["change"].setValue(change);
    this.f["change"].updateValueAndValidity();
  }

  updateData() {
    this.dataChange.emit(this.data);
  }

  updateValidity() {
    this.formValid = this.form.valid;
    this.formValidChange.emit(this.formValid);
  }
}
