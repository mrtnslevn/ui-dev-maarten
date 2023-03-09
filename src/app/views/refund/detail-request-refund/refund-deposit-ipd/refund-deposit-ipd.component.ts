import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalValidasiUserComponent } from 'src/app/general/general-modal/modal-validasi-user/modal-validasi-user.component';
import { Bank_Transfer } from 'src/app/general/models/div-card-payment/Bank_Transfer';
import { Cash } from 'src/app/general/models/div-card-payment/Cash';
import { Digital_Payment } from 'src/app/general/models/div-card-payment/Digital_Payment';
import { Edc } from 'src/app/general/models/div-card-payment/Edc';
import { BankTransferRefund } from 'src/app/general/models/div-card-refund/BankTransferRefund';
import { CashRefund } from 'src/app/general/models/div-card-refund/CashRefund';
import { CreditCardRefund } from 'src/app/general/models/div-card-refund/CreditCardRefund';
import { Payment } from 'src/app/general/models/Payment';
import { PaymentMode, PaymentModePayment, PaymentModeRefund } from 'src/app/general/models/PaymentMode';
import { RefundDepositIpd } from 'src/app/general/models/RefundDepositIpd';
import { RefundDepositIPDRequestReasonList } from 'src/app/general/models/RefundDepositIpdRequestReason';
import { SaveRefundRequest } from 'src/app/general/models/request/SaveRefundReq';
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { SaveRefundResponse } from 'src/app/general/models/response/SaveRefundResponse';
import { DepositIpdService } from 'src/app/service/deposit-ipd.service';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { RefundService } from 'src/app/service/refund.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, DEPOSITIPD, DEPOSIT_IPD_REFUND, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { ModalLargeConfig } from 'src/app/_configs/modal-config';
import { SaveRefundUtils } from 'src/app/_helpers/SaveRefundUtils';
import { RefundDepositIpdFormsComponent } from './refund-deposit-ipd-forms.service';

@Component({
  selector: 'app-refund-deposit-ipd',
  templateUrl: './refund-deposit-ipd.component.html',
  styleUrls: ['./refund-deposit-ipd.component.scss']
})
export class RefundDepositIpdComponent implements OnInit {
  loadPage: boolean = false
  orgId: number = 0
  patientInfo: RefundDepositIpd = RefundDepositIpd.default()

  getAdmissionNoResponse: any
  admissionNo: string = ''
  getDepositHistoryResponse: any
  depositHistory = []

  readOnlyOpeningBalance: boolean = true
  readOnlyRefundAmount: boolean = true
  readOnlyClosingBalance: boolean = true
  readOnlyNet: boolean = true
  readOnlyPaymentMode: boolean = true
  readOnlyReason: boolean = true
  readOnlyNotes: boolean = true
  
  openingBalance: number = 0
  refundAmount: number = 0
  closingBalance: number = 0
  net: number = 0
  selectedPaymentMode: PaymentMode = PaymentMode.default()
  selectedReason: PaymentMode = PaymentMode.default()
  notes: string = ''

  public disabledAdd: boolean = false
  public disabledSave: boolean = true
  public disabledCancel: boolean = true

  public payment: Payment = Payment.default()

  getListResponse!: GetListResponse
  paymentMode: PaymentModeRefund = PaymentModeRefund.default();
  public paymentModeList: PaymentMode[] = []
  reasonRefundList: RefundDepositIPDRequestReasonList[] = []

  formValid: PaymentModePayment = PaymentModePayment.default();

  cash: CashRefund = CashRefund.default();
  creditCard: CreditCardRefund = CreditCardRefund.default();
  bankTransfer: BankTransferRefund = BankTransferRefund.default();

  savePaymentProgress: boolean = false;
  savePaymentResponse!: SaveRefundResponse

  bsModalUserValidation?: BsModalRef

  constructor(
    public fs: RefundDepositIpdFormsComponent,
    private depositService: DepositIpdService,
    private alertService: ModalAlertService,
    private generalService: GeneralService,
    private token: TokenStorageService,
    private bsModalService: BsModalService,
    private refundService: RefundService
  ) { 
    this.fs.component = this;
    let params: string = window.sessionStorage.getItem(RefundDepositIpd.PARAM_KEY)!
    this.patientInfo = JSON.parse(params)
    this.patientInfo.deposit_amount = 1000000
  }

  ngOnInit(): void {
    this.fs.createForm();
    const userData = this.token.getUserData();
    this.orgId = userData.hope_organization_id;

    this.getList()
    this.getAdmissionNo()
  }

  getList(){
    this.loadPage = true
    const params = new HttpParams()
    .set('param_list', 'paymentModeForRefundList')
    .append('param_list', 'refundDepositIPDRequestReasonList')

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.paymentModeList = this.getListResponse.paymentModeForRefundList
          this.reasonRefundList = this.getListResponse.refundDepositIPDRequestReasonList
        }else{
          this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
        }
        this.loadPage = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
        this.loadPage = false
      });
  }

  getAdmissionNo(){
    const params = new HttpParams()
    .set('mr_no', this.patientInfo.mr_no)
    .set('org_id', this.orgId)

    return this.depositService.getDepositIpdList(params).subscribe(data => {
      this.getAdmissionNoResponse = {...data}
      if(this.getAdmissionNoResponse.response_code === RESPONSE_SUCCESS){
        this.admissionNo = this.getAdmissionNoResponse.master_deposit_list[0].admission_no
        this.getDepositIpdHistory()
      }
    },err => {
      this.alertService.showModalAlert(`An error has occured while get refund prepaid list, please contact administration`, ALERT_DANGER)
    })
  }

  getDepositIpdHistory(){
    const params = new HttpParams()
    .set('mr_no', this.patientInfo.mr_no)
    .set('admission_no',this.admissionNo)
    .set('org_id', this.orgId)

    return this.depositService.getDepositIpdHistory(params).subscribe(data => {
      this.getDepositHistoryResponse = {...data}
      if(this.getDepositHistoryResponse.response_code === RESPONSE_SUCCESS){
        this.depositHistory = this.getDepositHistoryResponse.deposit_history_list
      }
    },err => {
      this.alertService.showModalAlert(`An error has occured while get refund prepaid list, please contact administration`, ALERT_DANGER)
    })
  }

  setRefundValue(){
    this.fs.controls['refundAmount'].setValue(this.patientInfo.deposit_amount)
    this.openingBalance = this.patientInfo.deposit_amount
    this.closingBalance = 0
    this.net = this.patientInfo.deposit_amount
  }

  addPaymentMode(){
    this.disabledAdd = true
    this.disabledSave = false
    this.disabledCancel = false
    this.readOnlyRefundAmount = false
    this.readOnlyPaymentMode = false
    this.readOnlyReason = false
    this.readOnlyNotes = false

    this.setRefundValue()
  }

  onChangeRefundAmount(amount: any){
    this.refundAmount = amount
    this.net = amount
    this.closingBalance = this.openingBalance - this.refundAmount
  }

  displayPaymentMode(paymentModeName: string) {
    let paymentMode: any = {...this.paymentMode}
    for (const prop in paymentMode) {
      if (prop == paymentModeName) {
        paymentMode[prop] = true;
      }
      else paymentMode[prop] = false;
    }
    this.paymentMode = paymentMode;
  }

  onChangePaymentMode(selection: PaymentMode) {
    this.fs.submitted = false;
    if (selection == null) selection = { key: '', value: '' }
    
    // if payment mode from prepaid, set amount back

    this.selectedPaymentMode = selection;
    
    this.readOnlyRefundAmount = false;
    this.readOnlyReason = false
    this.readOnlyNotes = false
    switch(selection.key){
      case "1":
        // Cash
        this.displayPaymentMode("cash");
        break;
      case "2":
        // Credit Card
        this.displayPaymentMode("creditCard");
        break;
      case "6":
        // Bank Transfer
        this.displayPaymentMode("bankTransfer");
        break;
      default:
        this.displayPaymentMode("");
        break;
    }
  }

  onChangeReason(selection: any) {
    this.selectedReason = selection
  }

  onChangeNotes(e: any){
    this.notes = e
  }

  cancelAddPaymentMode(): void {
    
    this.readOnlyPaymentMode = true;
    this.readOnlyOpeningBalance = true;
    this.readOnlyClosingBalance = true;
    this.readOnlyNet = true;
    this.readOnlyNotes = true;
    this.readOnlyReason = true;
    this.readOnlyRefundAmount = true;

    this.disabledAdd = false;
    this.disabledCancel = true;
    this.disabledSave = true;

    // form.resetForm();
    this.fs.submitted = false;
    this.fs.reset();
  }

  showModalUserValidation(body: SaveRefundRequest) {
    this.bsModalUserValidation = this.bsModalService.show(ModalValidasiUserComponent, ModalLargeConfig)
    this.bsModalUserValidation.content.isUserValid.subscribe((data: any) => {
      this.saveRefund(body);
    })
  }

  submitAddPayment(){
    this.fs.submitted = true
    let valid: boolean = false
    let body: SaveRefundRequest = {
      refund_type: DEPOSIT_IPD_REFUND,
      mr_no: this.patientInfo.mr_no,
      org_id: this.orgId,
      admission_no: this.admissionNo,
      patient_id: this.patientInfo.patient_id,
      patient_name: this.patientInfo.patient_name,
      dob: this.patientInfo.dob,
      refund_documents: [],
      opening_balance: this.openingBalance,
      refund_amount: this.refundAmount,
      payment_mode_id: Number(this.selectedPaymentMode.key),
      refund_reason_id: Number(this.selectedReason.key),
      refund_reason_name: this.selectedReason.value,
      refund_notes: this.notes,
      request_type: 'refund-request'
    }

    switch (this.selectedPaymentMode.key) {
      case '1':
        SaveRefundUtils.cash(this.formValid, body, this.cash);
        valid = this.formValid.cash;
        break;
      case '2':
        // this.paymentRepository.getBankId(this.card.edc_id!);
        SaveRefundUtils.creditCard(this.formValid, body, this.creditCard);
        valid = this.formValid.edc
        break;

      case '6':
        SaveRefundUtils.bankTransfer(this.formValid, body, this.bankTransfer);
        valid = this.formValid.bankTransfer;
        break;
    }

    if (this.fs.valid && valid) {
      this.alertService.showModalConfirm('Are you sure to save this refund?').content.isConfirm
      .subscribe((isConfirm: boolean) => {
        this.showModalUserValidation(body)
      })
    }
    
  }

  saveRefund(body: SaveRefundRequest) {
    this.savePaymentProgress = true;
    this.refundService.saveRefundDeposit(body)
    .subscribe((data: SaveRefundResponse) => {
      this.savePaymentResponse = {...data};
      if (this.savePaymentResponse.response_code == RESPONSE_SUCCESS) {
        this.cancelAddPaymentMode();

        this.alertService.showModalAlertSuccess(`Successfully save refund deposit`)
      } else {
        this.alertService.showModalAlert(`Failed to save payment: ${this.savePaymentResponse.response_desc}`,ALERT_DANGER)
      }
      this.savePaymentProgress = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while save payment, please contact administration`, ALERT_DANGER)
      this.savePaymentProgress = false;
    });
  }

}
