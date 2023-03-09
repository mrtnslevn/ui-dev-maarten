import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ReturnItemValidationFormsService {

  errorMessages: any;

  formRules = {
    numberOnly: /^-?\d*[.]?\d{0,4}$/,
    quantityMin: 1
  };

  constructor() {
    this.errorMessages = {
      qty: {
        required: 'Quantity is required',
        pattern: 'Quantity must be number or decimal with max 4 decimal places',
        min: 'Quantity minimum value is 1'
      },
      uom:{
        required: 'UOM is required', 
      }
    };
  }
}
