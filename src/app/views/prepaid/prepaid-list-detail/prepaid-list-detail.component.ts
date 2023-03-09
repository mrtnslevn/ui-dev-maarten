import { PrepaidHistory } from './../models/prepaid-history.model';
import { Component, OnInit, Inject } from '@angular/core';
import { PrepaidService } from 'src/app/service/prepaid.service';
import { PrepaidDetail } from '../models/prepaid-detail.model';
import { ActivatedRoute } from '@angular/router';
import { HttpParams } from '@angular/common/http';
import { GetPrepaidHistoryResponse } from 'src/app/general/models/response/GetPrepaidHistoryResponse';
import { ALERT_DANGER, ALERT_SUCCESS, ALERT_WARNING, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { PaymentMode, PaymentModePayment } from 'src/app/general/models/PaymentMode';
import { GeneralService } from 'src/app/service/general.service';
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalPaymentTypeComponent } from 'src/app/general/general-modal/modal-payment-type/modal-payment-type.component';
import { ModalDefaultConfig, ModalLargeConfig } from 'src/app/_configs/modal-config';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Payment } from 'src/app/general/models/Payment';
import { SavePaymentPrepaidRequest } from 'src/app/general/models/request/SavePaymentReq';
import { SavePaymentUtils } from 'src/app/_helpers/SavePaymentUtils';
import { SavePaymentResponse } from 'src/app/general/models/response/SavePaymentResponse';
import { BookingPaymentService } from 'src/app/service/booking-payment.service';
import { Cash } from 'src/app/general/models/div-card-payment/Cash';
import { Edc } from 'src/app/general/models/div-card-payment/Edc';
import { Digital_Payment } from 'src/app/general/models/div-card-payment/Digital_Payment';
import { Bank_Transfer } from 'src/app/general/models/div-card-payment/Bank_Transfer';
import { Qris } from 'src/app/general/models/div-card-payment/Qris';
import { Giro } from 'src/app/general/models/div-card-payment/Giro';
import { Payer } from 'src/app/general/models/div-card-payment/Payer';
import { Patient } from 'src/app/general/models/Patient';
import { firstValueFrom } from 'rxjs';
import { GetPrepaidTransactionResponse } from 'src/app/general/models/response/GetPrepaidTransactionResponse';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ModalValidasiUserComponent } from 'src/app/general/general-modal/modal-validasi-user/modal-validasi-user.component';
import { Package } from 'src/app/general/models/Package';

@Component({
  selector: 'app-prepaid-list-detail',
  templateUrl: './prepaid-list-detail.component.html',
  styleUrls: ['./prepaid-list-detail.component.scss']
})
export class PrepaidListDetailComponent implements OnInit {

  public getPrepaidTransactionResponse!: GetPrepaidTransactionResponse
  
  public prepaidDetail: any = {}
  public prepaidHistory: Array<PrepaidHistory> = []
  public prepaidDetails: Array<PrepaidDetail> = []
  public prepaidPaymentSettlement: any = []

  public readOnlyAmount: boolean = true
  public readOnlyPaymentMode: boolean = true
  public readOnlyBank : boolean = true
  public readOnlyAmountToSettled : boolean = true
  public readOnlySettleAmount : boolean = true
  public readOnlyBalance : boolean = true
  public readOnlyDeposit : boolean = true
  public readOnlyNet : boolean = true

  public disabledAdd: boolean = false
  public disabledSave: boolean = true
  public disabledCancel: boolean = true
  public showCardPayment: boolean = false
  public loadCardPaymentSettlement: boolean = false

  public getListResponse: any
  public listPaymentMode: PaymentMode[] = []
  public selectedPaymentMode: any
  
  getParams: any
  params: any
  bookId: string = ""
  prepaidId: string = ""
  prepaidDate: string = ""
  org_id: number = 0
  loadPage: boolean = true

  bsModal?: BsModalRef

  cash: Cash = Cash.default();
  card: Edc = Edc.default();
  digitalPayment: Digital_Payment = Digital_Payment.default();
  bankTransfer: Bank_Transfer = Bank_Transfer.default();
  qris: Qris = Qris.default();
  giro: Giro = Giro.default();
  payer: Payer = Payer.default()

  paymentForm!: FormGroup;
  submitted: boolean = false;
  formErrors: any;
  public payment: Payment = Payment.default()
  paymentMode: PaymentModePayment = PaymentModePayment.default()
  formValid: PaymentModePayment = PaymentModePayment.default()

  progress: boolean = false
  savePaymentResponse: any
  patient: Patient = Patient.default()
  paramsPaymentSettlement = new HttpParams()

  bsModalShowAlert?: BsModalRef
  bsModalUserValidation?: BsModalRef

  constructor(
    private generalService: GeneralService, 
    private prepaidService: PrepaidService, 
    public bsModalService: BsModalService,
    private route: ActivatedRoute, 
    private token: TokenStorageService, 
    private fb: FormBuilder,
    private bookingPaymentService: BookingPaymentService,
    private alertService: ModalAlertService) { }

  ngOnInit(): void {
    const userData = this.token.getUserData();
    this.org_id = userData.hope_organization_id;

    this.getParams = this.route.params.subscribe(params => {
      this.bookId = params['bookId'];
      this.prepaidId = params['prepaidId'];
    })

    this.params = new HttpParams()
    .set('booking_id',this.bookId)
    .set('page_no',1)

    this.createForm()

    this.getPaymentMode()
    this.getBookingDetail()
    this.getHistory()
    this.getDetailList()
    this.getPaymentSettlement()
  }

  createForm() {
    this.paymentForm = this.fb.group({
      amount: [this.payment.amount, 
        [
          Validators.required,
          (control: AbstractControl) => Validators.max(this.payment.balance)(control)
        ]],
      paymentMode: ['', [Validators.required]]
    })
  }

  get f() {
    return this.paymentForm.controls;
  }

  get cashForm() {
    return (this.f["cash"]) as FormGroup;
  }

  isFormError(formName: string) {
    return this.submitted && this.f[formName].errors;
  }

  isFormValid(formName: string) {
    return { 'is-invalid': this.submitted && this.f[formName].errors, 
              'is-valid': this.submitted && !this.f[formName].errors }
  }

  getErrors(formName: string): any {
    return this.f[formName].errors;
  }

  getErrorMessage(formName: string, error: any): string {
    return this.formErrors[formName][error];
  }

  getPaymentMode(){
    const params = new HttpParams()
    .set('param_list', 'paymentModeListForPrepaid')

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.listPaymentMode = this.getListResponse.paymentModeListForPrepaid;
        }else{
          this.alertService.showModalAlert(`Failed to get payment mode: ${this.getListResponse.response_desc}`,ALERT_DANGER)
          this.progress = false
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get payment mode, please contact administration`, ALERT_DANGER)
        this.progress = false
      });
  }

  getBookingDetail(){
    const params = new HttpParams()
    .set('booking_id',this.bookId)

    return this.prepaidService.getBookingDetail(params)
      .subscribe((data)=>
      {
        if(data.response_code === RESPONSE_SUCCESS){
          this.prepaidDetail.booking_id = data.booking_id;
          this.prepaidDetail.expired_date = data.expired_date;
          this.prepaidDetail.order_id = data.order_id;
          this.prepaidDetail.service = data.service;
          this.prepaidDetail.status = data.status;
        }else{
          this.alertService.showModalAlert(`Failed to get booking detail: ${data.response_desc}`, ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get booking detail, please contact administration`, ALERT_DANGER)
      });
  }

  getHistory(){
    return this.prepaidService.getHistory(this.params)
      .subscribe((data: GetPrepaidHistoryResponse)=>
      {
        if(data.response_code === RESPONSE_SUCCESS){
          this.prepaidHistory = data.prepaid_history_list;
        }else{
          this.alertService.showModalAlert(`Failed to get history: ${data.response_desc}`,ALERT_DANGER)
        }
        this.loadPage = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get history, please contact administration`, ALERT_DANGER)
        this.loadPage = false
      });
  }

  async getDetailList(){
    const params = new HttpParams()
    .set('prepaid_id', this.prepaidId)

    this.getPrepaidTransactionResponse = await firstValueFrom(this.prepaidService.getDetailList(params));
    this.prepaidDetails = this.getPrepaidTransactionResponse.prepaid_detail_list;
    this.payment.amount_to_settled = this.getPrepaidTransactionResponse.amount_to_be_settled
    this.payment.balance = this.getPrepaidTransactionResponse.balance
    this.payment.settle_amount = this.getPrepaidTransactionResponse.settled_amount
    this.prepaidDate = this.getPrepaidTransactionResponse.prepaid_date
    if (this.payment.balance > 0 ){
      this.showCardPayment = true
    }
    this.patient.patient_name = this.getPrepaidTransactionResponse.patient_name
    this.patient.email = this.getPrepaidTransactionResponse.email
    this.patient.contact_no = this.getPrepaidTransactionResponse.phone_no
    this.patient.address = this.getPrepaidTransactionResponse.address
    const bookId = this.prepaidDetails[0].booking_id
    return bookId;
  }

  getPaymentSettlement(){
    this.loadCardPaymentSettlement = true

    this.paramsPaymentSettlement = this.paramsPaymentSettlement
    .set('transaction_no', this.prepaidId)
    .set('transaction_type', "Prepaid")
    .set('org_id', this.org_id)
    .set('page_no',1)

    return this.prepaidService.getPaymentSettlement(this.paramsPaymentSettlement)
      .subscribe((data)=>
      {
        if(data.response_code === RESPONSE_SUCCESS){
          this.prepaidPaymentSettlement = data.payment_settlement_list;
        }else{
          this.alertService.showModalAlert(`Failed to get data payment settlement: ${data.response_desc}`,ALERT_DANGER)
        }
        this.loadCardPaymentSettlement = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get data payment settlement, please contact administration`, ALERT_DANGER)
        this.loadCardPaymentSettlement = false
      });
  }

  addPaymentMode(): void {
    this.readOnlyAmount = false
    this.readOnlyPaymentMode = false;
    this.disabledAdd = true;
    this.disabledCancel = false;
    this.disabledSave = false;

    this.paymentForm.controls["amount"].setValue(this.payment.balance)
  }

  onChangePaymentAmount(amount: any) {
    const newPayment: Payment = {...this.payment};
    newPayment.amount = amount;
    newPayment.net = amount;
    this.payment = newPayment;
  }

  displayPaymentMode(paymentModeName: string) {
    let paymentMode: any = {...this.paymentMode}
    for (const prop in paymentMode) {
      if (prop == paymentModeName) paymentMode[prop] = true;
      else paymentMode[prop] = false;
    }
    this.paymentMode = paymentMode;
  }

  onChangePaymentMode(selection: any) {
    this.submitted = false;
    if (selection == null) selection = { key: '', value: '' }
    this.selectedPaymentMode = selection;

    switch(selection.key){
      // Cash
      case "1":
        this.displayPaymentMode("cash");
        break;
      // Debit Card
      case "3":
      // Credit Card
        this.displayPaymentMode("edc");
        break;
      case "2":
        this.displayPaymentMode("edc");
        break;
      // Additional Payer
      case "9":
        this.displayPaymentMode("payer");
        break;
      // Digital Payment
      case "10":
        this.displayPaymentMode("digitalPayment");
        break;
      // Bank Transfer
      case "6":
        this.displayPaymentMode("bankTransfer");
        break;
      // Cheque
      case "4":
        this.displayPaymentMode("giro");
        break;
      default:
        this.displayPaymentMode("");
        break;
    }
  }

  showSettlementDetail(settlementNo: string): void{
    const initialState: ModalOptions = {
      initialState: {
        settlement_no: settlementNo,
      },
    };
    this.bsModal = this.bsModalService.show(ModalPaymentTypeComponent, Object.assign(ModalLargeConfig, initialState))
  }

  submitAddPayment(){
    this.submitted = true
    let valid: boolean = false
    let body: SavePaymentPrepaidRequest = {
      prepaid_id: this.prepaidId,
      payment_mode_id: Number(this.selectedPaymentMode.key),
      amount: this.payment.amount,
      balance: this.payment.balance,
      notes: "",
    }
    if (this.paymentForm.valid) {
      switch (this.selectedPaymentMode.key) {
        case '1':
          SavePaymentUtils.cash(this.formValid, body, this.cash);
          valid = this.formValid.cash
          break;
        case '2':
          SavePaymentUtils.creditCard(this.formValid, body, this.card);
          valid = this.formValid.edc
          break;
        case '3':
          SavePaymentUtils.debitCard(this.formValid, body, this.card);
          valid = this.formValid.edc
          break;
        case '4':
          SavePaymentUtils.chequeGiro(this.formValid, body, this.giro);
          valid = this.formValid.giro
          break;
        case '6':
          SavePaymentUtils.bankTransfer(this.formValid, body, this.bankTransfer);
          valid = this.formValid.bankTransfer
          break;
        case '9':
          SavePaymentUtils.additionalPayer(this.formValid, body, this.payer);
          valid = this.formValid.payer
          break;
        case '10':
          SavePaymentUtils.digitalPayment(this.formValid, body, this.digitalPayment, 
            this.patient);
            valid = this.formValid.digitalPayment
          break;
        case '11':
          SavePaymentUtils.qris(this.formValid, body, this.qris, this.patient);
          valid = this.formValid.qris
          break;
      }
      if (this.paymentForm.valid && valid) {
        this.alertService.showModalConfirm('Are you sure you want to save this payment?').content.isConfirm.subscribe((item: any)=>{
          this.showModalUserValidation(body)
        })
      }
    }
  }

  async showModalUserValidation(body?: any){
    this.bsModalUserValidation = this.bsModalService.show(ModalValidasiUserComponent, ModalLargeConfig)

    this.bsModalUserValidation.content.isUserValid.subscribe((data: Package | any) => {
      if(data){
        this.savePayment(body)
      }else{
        this.alertService.showModalAlert("User not valid",ALERT_WARNING)
      }
    })
  }

  async savePayment(body: SavePaymentPrepaidRequest) {
    this.progress = true;
    this.bookingPaymentService.savePrepaidPayment(body).subscribe(async (data: SavePaymentResponse) => {
      this.savePaymentResponse = {...data};
      if (this.savePaymentResponse.response_code == RESPONSE_SUCCESS) {
        this.alertService.showModalAlert("Your payment is saved",ALERT_SUCCESS)
        this.payment.settle_amount = this.savePaymentResponse.settled_amount
        this.payment.balance =  this.savePaymentResponse.balance
        if(data.balance==0 && this.prepaidDetail.service == 'OPD'){
          this.bookId = await this.getDetailList()
          this.getBookingDetail()
        }
        this.cancelAddPaymentMode();
        this.getHistory()
        this.getPaymentSettlement();
      } else {
        this.alertService.showModalAlert(`Failed to save payment: ${this.savePaymentResponse.response_desc}`,ALERT_DANGER);
      }
      this.progress = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while save payment, please contact administration`, ALERT_DANGER)
      this.progress = false;
    });
  }

  cancelAddPaymentMode(): void {
    this.readOnlyAmount = true;
    this.readOnlyPaymentMode = true;

    this.disabledAdd = false;
    this.disabledCancel = true;
    this.disabledSave = true;

    this.paymentForm.reset();
  }

}
