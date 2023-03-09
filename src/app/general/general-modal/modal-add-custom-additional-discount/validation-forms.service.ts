import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CustomAdditionalDiscountValidationFormsService {

  errorMessages: any;

  formRules = {
    numberOnly: /^-?\d*[.,]?\d{0,4}$/,
  };

  constructor() {
    this.errorMessages = {
      transactionLevel: {
        required: 'Transaction Level is required',
      },
      salesItemType: {
        required: 'Sales Item Type is required',
        item_exist: "This Sales Item Type Discount already exist"
      },
      salesItemGroup: {
        required: 'Sales Item Group is required',
        item_exist: "This Sales Item Group Discount already exist"
      },
      salesItem: {
        required: 'Sales Item is required',
        item_exist: "This Sales Item Discount already exist"
      },
      orderedItem: {
        required: 'Please select order item',
        item_exist: "This Ordered Item Discount already exist"
      },
      portionType: {
        required: 'Portion Type is required'
      },
      discountType: {
        required: 'Discount Type is required'
      },
      discountFactor: {
        required: 'Discount Factor is required',
        pattern: 'Discount Factor must be number or decimal with max 4 decimal places'
      },
      notes: {

      }
    };
  }
}
