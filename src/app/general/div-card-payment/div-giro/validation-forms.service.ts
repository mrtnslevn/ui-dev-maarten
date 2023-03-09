import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class GiroValidationFormsService {

  errorMessages: any;

  formRules = {
  };

  constructor() {
    this.errorMessages = {
      bank_id: {
        required: 'Bank is required',
      },
      cheque_no: {
        required: 'Cheque/Giro No. is required'
      },
      cheque_date: {
        required: 'Cheque/Giro Date is required', 
      }
    };
  }
}
