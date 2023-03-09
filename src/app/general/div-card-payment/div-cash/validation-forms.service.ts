import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CashValidationFormsService {

  errorMessages: any;

  formRules = {
    numberOnly: "^[0-9]*$",
  };

  constructor() {
    this.errorMessages = {
      cashAmount: {
        required: 'Cash is required',
        pattern: 'Cash must be number',
        min: 'Cash must be equal to or greater than amount'
      },
      change: {
        required: 'Change is required',
        pattern: 'Change must be number'
      }
    };
  }
}
