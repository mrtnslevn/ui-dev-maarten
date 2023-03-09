import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class BookingPaymentValidationFormsService {

  errorMessages: any;
  errorInvoiceMessages: any
  errorAddBookingMessages: any

  formRules = {
    numberOnly: /^-?\d*[.]?\d{0,4}$/,
  };

  constructor() {
    this.errorAddBookingMessages = {
      service: {
        required: 'Service is required',
      },
      covidTestingType: {
        required: 'Covid Testing Type is required',
      },
      specialization: {
        required: 'Specialization is required',
      },
      doctor: {
        required: 'Doctor is required',
      },
      appointmentDate: {
        required: 'Appointment Date is required',
      },
      appointmentTime: {
        required: 'Appointment Time is required',
      },
      appointmentTimeSlot: {
        required: 'Appointment Time Slot is required',
      },
      appointmentTimeCovidTesting: {
        required: 'Appointment Time Covid Testing is required',
      },
    };

    this.errorInvoiceMessages = {
      discountType: {
        required: 'Discount Type is required',
      },
      discountFactor: {
        pattern: 'Quantity must be number or decimal with max 4 decimal places',
      }
    };

    this.errorMessages = {
      amount: {
        required: 'Amount is required',
        max: 'Paid amount is bigger than balance',
        pattern: 'Amount must be number'
      },
      paymentMode: {
        required: 'Payment Mode is required', 
      }
    }
  }
}
