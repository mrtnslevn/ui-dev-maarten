import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ValidationFormsService {

  errorMessages: any;

  formRules = {
    nonEmpty: '^[a-zA-Z0-9]+([_ -]?[a-zA-Z0-9])*$',
    passwordMin: 8,
    passwordPattern: '(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{6,}'
  };

  formErrors = {
    old_password: '',
    new_password: '',
    confirm_password: '',
  };

  constructor() {
    this.errorMessages = {
      old_password: {
        required: 'Password is required',
      },
      new_password: {
         required: 'New Password is required',
         pattern: 'Password must contain: numbers, uppercase and lowercase letters',
         minlength: `Password must be at least ${this.formRules.passwordMin} characters`
       },
      confirm_password: {
        required: 'Password confirmation is required',
        password_mismatch: 'Passwords must match',
      },
    };
  }
}