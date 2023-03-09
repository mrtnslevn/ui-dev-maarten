import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationFormsService {

  errorMessages: any;

  formRules = {
    nonEmpty: '^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$',
    numberOnly: "^[0-9]*$",
    patientNameMin: 3,
  };

  formErrors = {
    name: '',
    dob: '',
    password: ''
  };

  constructor() {
    this.errorMessages = {
      name: {
        required: 'Patient name is required',
        minlength: 'Patient Name must be 3 characters or more'
      },
      refundType:{
        required: 'Refund type is required', 
      },
      bookingId: {
        pattern: 'Booking Id must be number'
      },
      refundId: {
        pattern: 'Booking Id must be number'
      },
      mrNo: {
        pattern: 'Mr. No must be number'
      }
    };
  }
}
