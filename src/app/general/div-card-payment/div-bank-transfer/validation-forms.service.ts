import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BankTransferValidationFormsService {

  errorMessages: any;

  formRules = {
  };

  constructor() {
    this.errorMessages = {
      bank: {
        required: 'Bank is required'
      },
      accountNo: {
        required: 'Account No. is required'
      },
      accountName: {
        required: 'Account Name is required'
      },
      transferDate: {
        required: 'Transfer Date is required'
      },
      referenceNo: {
        required: 'Reference No. is required'
      },
      receiptBankAcc: {
        required: 'Receipt Bank Acc. is required'
      }
    };
  }
}
