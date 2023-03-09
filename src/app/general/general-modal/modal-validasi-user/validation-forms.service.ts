import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserValidationFormsService {

  errorMessages: any;

  formRules = {
    numberOnly: "^[0-9]*$",
  };

  constructor() {
    this.errorMessages = {
      // userId: {
      //   required: 'User is required',
      // },
      password: {
        required: 'Password is required',
      },
    };
  }
}
