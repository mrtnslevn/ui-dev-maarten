import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PrepaidValidationFormsService {

  errorMessages: any;

  formRules = {
  };

  constructor() {
    this.errorMessages = {
      bookingId: {
        required: 'Booking ID is required',
      }
    };
  }
}
