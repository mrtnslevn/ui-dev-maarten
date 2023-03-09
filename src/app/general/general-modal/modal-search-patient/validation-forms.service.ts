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
      dob:{
        required: 'Date of birth is required', 
      },
      password: {
        required: 'Password is required'
      },
      mrNo: {
        pattern: 'Mr. No must be number'
      }
    };
  }
}
