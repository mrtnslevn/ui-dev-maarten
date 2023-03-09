import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationFormsService {

  errorMessages: any;

  formRules = {
    nonEmpty: '^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$',
  };

  formErrors = {
    user_name: '',
    email: ''
  };

  constructor() {
    this.errorMessages = {
      user_name: {
        required: 'Username is required',
      },
      email: {
         required: 'Email is required',
       },
    };
  }
}