import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class EdcValidationFormsService {

  errorMessages: any;

  formRules = {
  };

  constructor() {
    this.errorMessages = {
      merchantId: {
        required: 'Merchant ID is required'
      },
      cardNo: {
        required: 'Card No. is required'
      },
      bank: {
        required: 'Bank is required'
      },
      approvalCode: {
        required: 'Approval Code is required'
      },
      transactionId: {
        required: 'Transaction ID is required'
      },
      referenceNo: {
        required: 'Reference No. is required'
      }
    };
  }
}
