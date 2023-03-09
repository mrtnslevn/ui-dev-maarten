import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AddSalesItemValidationFormsService {

  errorMessages: any;

  formRules = {
    numberOnly: /^-?\d*[.]?\d{0,4}$/,
    quantityMin: 1
  };

  constructor() {
    this.errorMessages = {
      admissionNo: {
        required: 'Admission No. is required',
      },
      salesItemCategory: {
        required: 'Sales Item Category is required'
      },
      salesItemType:{
        required: 'Sales Item Type is required', 
      },
      store: {
        required: 'Store is required', 
      },
      quantity: {
        required: 'Quantity is required',
        pattern: 'Quantity must be number or decimal with max 4 decimal places',
        min: `Quantity minimum value is ${this.formRules.quantityMin}`,
        max: 'Quantity cannot be more than stock'
      },
      startDate: {
        required: 'Start Date is required', 
      },
      doctor: {
        required: 'Doctor is required', 
      },
      uom: {
        required: 'Uom is required', 
      },
      stock: {
        required: 'Stock is required',
      },
      salesItemName: {
        required: 'Sales Item is required', 
      },
      pricePerItem: {
        required: 'Price Per Item is required', 
      },
      endDate: {
        required: 'End Date is required', 
      },
      notes: {
        required: 'Notes is required', 
      },
      email: {
        required: 'Email is required'
      },
      isCito: {
        required: 'Cito is required'
      }
    };
  }
}
