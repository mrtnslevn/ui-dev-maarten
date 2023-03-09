import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesDiscountValidationFormsService {

  errorMessages: any;

  formRules = {

  };

  constructor() {
    this.errorMessages = {
      admissionNo: {
        required: 'Admission No. is required',
      },
      discountType :{
        required: 'Discount Type is required', 
      },
      predefinedDiscount: {
        required: 'Predefined Discount is required'
      }
    };
  }
}
