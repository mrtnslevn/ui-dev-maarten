import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DepositorFormService {

  errorMessages: any;

  formRules = {
  };

  constructor() {
    this.errorMessages = {
      identityType: {
        required: 'Identity Type is required'
      },
      identityNo: {
        required: 'Identity No. is required'
      },
      depositorName: {
        required: 'Depositor Name is required'
      },
      depositorDob: {
        required: 'Depositor Dob is required'
      },
      depositorAddress: {
        required: 'Depositor Address is required'
      },
      depositorEmail: {
        required: 'Depositor Email is required'
      },
      depositorPhone: {
        required: 'Depositor Handphone is required'
      },
      depositorRelation: {
        required: 'Depositor Relation is required'
      },
      depositorFile: {
        required: 'Depositor Identity is required'
      }
    };
  }
}
