import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DigitalPaymentValidationFormsService {

  errorMessages: any;

  formRules = {
  };

  constructor() {
    this.errorMessages = {
      whatsappNo: {
        required: 'Whatsapp No. is required',
      },
      email: {
        required: 'Email is required', 
      }
    };
  }
}
