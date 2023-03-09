import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PayerValidationFormsService {

  errorMessages: any;

  formRules = {
  };

  constructor() {
    this.errorMessages = {
      payer: {
        required: 'Payer is required',
      },
      payerIdNo: {
        required: 'Payer ID No. is required'
      },
      eligibilityNo: {
        required: 'Eligibility No. required', 
      }
    };
  }
}
