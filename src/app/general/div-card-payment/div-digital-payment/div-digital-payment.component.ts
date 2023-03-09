import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { PaymentService } from 'src/app/service/payment.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { Digital_Payment } from "../../models/div-card-payment/Digital_Payment";
import { Invoice } from '../../models/Invoice';
import { Patient } from '../../models/Patient';
import { Payment } from '../../models/Payment';
import { MidtransPaymentReq } from '../../models/request/MidtransPaymentReq';
import { MidtransInquiryStatusResponse } from '../../models/response/MidtransInquiryStatusResponse';
import { MidtransPaymentResponse } from '../../models/response/MidtransPaymentResponse';
import { DigitalPaymentValidationFormsService } from './validation-forms.service';

@Component({
  selector: 'app-div-digital-payment',
  templateUrl: './div-digital-payment.component.html',
  styleUrls: ['./div-digital-payment.component.scss']
})
export class DivDigitalPaymentComponent implements OnInit {

  @Input() isPaymentSettlement: boolean = false
  public _readOnly: boolean = false;
  @Input() set readOnly(readOnly: boolean) {
    this._readOnly = readOnly;
    if (!this._readOnly) {
      this.formRequired();
      this.data = Digital_Payment.default()
      this.process = false
      return;
    } 

    this.clearForm();
  }
  @Input() notes: string = '';
  @Input() transactionType: string = '';

  @Input() data: Digital_Payment = Digital_Payment.default();
  @Output() dataChange = new EventEmitter<Digital_Payment>();

  @Input() patientInfo: Patient = Patient.default();
  @Input() invoice: Invoice = Invoice.default();
  @Input() payment: Payment = Payment.default();
  @Input() prepaidDate: string = ''
  @Input() prepaidId: string = ''

  @Input() submitted: boolean = false;
  @Output() submittedChange = new EventEmitter<boolean>();
  
  @Input() paymentFormValid: boolean = false;
  @Input() formValid: boolean = false;
  @Output() formValidChange = new EventEmitter<boolean>();

  form!: FormGroup;
  formErrors: any;
  process: boolean = false;
  processed: boolean = false;

  midtransPaymentResponse: MidtransPaymentResponse | undefined;
  midtransInquiryStatusResponse: MidtransInquiryStatusResponse | undefined;
  progress: boolean = false;

  userData: any

  bsModalShowAlert?: BsModalRef

  constructor(private fb: FormBuilder, private vf: DigitalPaymentValidationFormsService,
    private paymentService: PaymentService, private bsModalService : BsModalService,
    private alertService: ModalAlertService,
    private token: TokenStorageService) { 
    this.formErrors = this.vf.errorMessages;
    this.createForm();
  }

  ngOnInit(): void {
    this.userData = this.token.getUserData();
  }

  get f() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      whatsappNo: ['', [Validators.required]],
      email: ['', [Validators.required]],
      notes: ['', []]
    })
  }

  formRequired() {
    this.f["whatsappNo"].enable()
    this.f["whatsappNo"].setValue(this.patientInfo.contact_no);
    this.f["whatsappNo"].updateValueAndValidity();

    this.f["email"].enable()
    this.f["email"].setValue(this.patientInfo.email);
    this.f["email"].updateValueAndValidity();
  }

  clearForm() {
    for (const name in this.f) {
      this.f[name].disable();
    }
  }

  isFormValid(formName: string) {
    return { 'is-invalid': (this.submitted || this.process) && this.f[formName].errors, 
              'is-valid': (this.submitted || this.process) && !this.f[formName].errors }
  }

  isFormError(formName: string) {
    return (this.submitted || this.process) && this.f[formName].errors;
  }

  getErrors(formName: string): any {
    return this.f[formName].errors;
  }

  getErrorMessage(formName: string, error: any): string {
    return this.formErrors[formName][error];
  }

  onChangeWhatsappNo(value: string) {
    this.data.whatsapp_no = value;
    this.updateValidity();
  }

  onChangeEmail(value: string) {
    this.data.email = value;
    this.updateValidity();
  }

  onChangeNoets(notes: string) {
    this.data.notes = notes;
    this.updateValidity();
  }

  updateValidity() {
    this.formValid = this.form.valid;
    this.formValidChange.emit(this.formValid);
    this.dataChange.emit(this.data);
  }

  onValidateProcessDigitalPayment() {
    this.process = true;
    this.submitted = true;
    this.submittedChange.emit(this.submitted);
    if (this.form.valid && this.paymentFormValid && this.submitted) this.processDigitalPayment();
    this.updateValidity();
  }

  processDigitalPayment() {
    this.progress = true;

    let dateArr: string[]
    let billing_date: string | undefined = ''
    let transaction_no: string
    if(this.transactionType=='Payment'){
      dateArr = this.invoice.invoice_date.split("T");
      transaction_no = this.invoice.invoice_no!
    }else{
      dateArr = this.prepaidDate.split("T");
      transaction_no = this.prepaidId
    }
    billing_date = `${dateArr[0]} ${dateArr[1]}`;


    let req: MidtransPaymentReq = {
      transaction_type: this.transactionType,
      transaction_no: transaction_no,
      billing_date: billing_date,
      amount: this.payment.amount,
      first_name: this.patientInfo.patient_name,
      email: this.f["email"].value,
      phone: this.f["whatsappNo"].value,
      address: this.patientInfo.address,
      city: this.patientInfo.city_name,
      organization_name: this.userData.organization_name
    }
    this.paymentService.midtransPayment(req).subscribe((data: MidtransPaymentResponse) => {
      this.midtransPaymentResponse = {...data};
      if (this.midtransPaymentResponse.response_code == RESPONSE_SUCCESS) {
        for (const prop in this.midtransPaymentResponse) {
          const parse: any = this.midtransPaymentResponse;
          if (parse[prop] != null && parse[prop] !== undefined) {
            (this.data as any)[prop] = parse[prop];
          }
        }
        this.processed = true;
        this.dataChange.emit(this.data);
      } else {
        this.alertService.showModalAlert(`Failed to get midtrans payment: ${this.midtransPaymentResponse.response_desc}`,ALERT_DANGER)
      }
      this.progress = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get midtrans payment, please contact administration`, ALERT_DANGER)
      this.progress = false;
    })
  }

  checkDigitalPaymentStatus() {
    this.progress = true;
    const params = new HttpParams().set("invoice_no", this.data.payment_code)
    .set("payment_code", this.data.payment_code);

    this.paymentService.midtransInquiryStatus(params)
    .subscribe((data: MidtransInquiryStatusResponse) => {
      this.midtransInquiryStatusResponse = {...data};
      if (this.midtransInquiryStatusResponse.response_code == RESPONSE_SUCCESS) {
        for (const prop in this.midtransInquiryStatusResponse) {
          const parse: any = this.midtransInquiryStatusResponse;
          if (parse[prop] != null && parse[prop] !== undefined) {
            (this.data as any)[prop] = parse[prop];
          }
        }
        this.dataChange.emit(this.data);
      } else {
        this.alertService.showModalAlert(`Mid trans inquiry failed: ${this.midtransInquiryStatusResponse.response_desc}`,ALERT_DANGER)
      }
      this.progress = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while do mid trans inquiry, please contact administration`, ALERT_DANGER)
      this.progress = false;
    })
  }

}
