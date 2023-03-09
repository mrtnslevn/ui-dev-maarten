import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalValidasiUserComponent } from 'src/app/general/general-modal/modal-validasi-user/modal-validasi-user.component';
import { BankTransferRefund } from 'src/app/general/models/div-card-refund/BankTransferRefund';
import { CashRefund } from 'src/app/general/models/div-card-refund/CashRefund';
import { CreditCardRefund } from 'src/app/general/models/div-card-refund/CreditCardRefund';
import { Payment } from 'src/app/general/models/Payment';
import { PaymentMode, PaymentModePayment, PaymentModeRefund } from 'src/app/general/models/PaymentMode';
import { RefundPrepaid } from 'src/app/general/models/RefundPrepaid';
import { SaveRefundRequest } from 'src/app/general/models/request/SaveRefundReq';
import { SaveRefundResponse } from 'src/app/general/models/response/SaveRefundResponse';
import { DepositIpdService } from 'src/app/service/deposit-ipd.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { PrepaidService } from 'src/app/service/prepaid.service';
import { RefundService } from 'src/app/service/refund.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, PREPAID_REFUND, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { ModalLargeConfig } from 'src/app/_configs/modal-config';
import { SaveRefundUtils } from 'src/app/_helpers/SaveRefundUtils';
import { RefundPrepaidDetailFormsComponent } from './refund-prepaid-detail-forms.service';

@Component({
  selector: 'app-refund-prepaid-detail',
  templateUrl: './refund-prepaid-detail.component.html',
  styleUrls: ['./refund-prepaid-detail.component.scss']
})
export class RefundPrepaidDetailComponent implements OnInit {
  loadPage: boolean = false
  prepaidInfo: RefundPrepaid
  orgId: number = 0

  getAdmissionNoResponse: any
  admissionNo: string = ''
  getPrepaiRefunddHistoryResponse: any
  prepaidRefundHistory = []

  readOnlyOpeningBalance: boolean = false
  readOnlyRefundAmount: boolean = false
  readOnlyClosingBalance: boolean = false
  readOnlyNet: boolean = false
  readOnlyPaymentMode: boolean = false
  readOnlyReason: boolean = false
  readOnlyNotes: boolean = false

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

  paymentMode: PaymentModeRefund = PaymentModeRefund.default();
  public paymentModeList: PaymentMode[] = []

  formValid: PaymentModePayment = PaymentModePayment.default();

  cash: CashRefund = CashRefund.default();
  creditCard: CreditCardRefund = CreditCardRefund.default();
  bankTransfer: BankTransferRefund = BankTransferRefund.default();

  savePaymentProgress: boolean = false;
  savePaymentResponse!: SaveRefundResponse
  bsModalUserValidation?: BsModalRef

  constructor(public fs: RefundPrepaidDetailFormsComponent,
    private token: TokenStorageService,
    private bsModalService: BsModalService,
    private refundService: RefundService,
    private alertService: ModalAlertService,
    private prepaidService: PrepaidService) {
      this.fs.component = this;
      let params: string = window.sessionStorage.getItem(RefundPrepaid.PARAM_KEY)!
      this.prepaidInfo = JSON.parse(params)
   }

  ngOnInit(): void {
    this.fs.createForm();

    const userData = this.token.getUserData();
    this.orgId = userData.hope_organization_id;

    this.getPrepaidHistory()
  }

  getPrepaidHistory(){
    const params = new HttpParams()
    .set('booking_id', this.prepaidInfo.booking_id)

    return this.prepaidService.getHistory(params).subscribe(data => {
      this.getPrepaiRefunddHistoryResponse = {...data}
      if(this.getPrepaiRefunddHistoryResponse.response_code === RESPONSE_SUCCESS){
        this.prepaidRefundHistory = this.getPrepaiRefunddHistoryResponse.prepaid_history_list
      }
    },err => {
      this.alertService.showModalAlert(`An error has occured while get refund prepaid list, please contact administration`, ALERT_DANGER)
    })
  }
  
  onChangeRefundAmount(amount: any){}

  onChangePaymentMode(selection: PaymentMode) {}

  onChangeReason(selection: any) {}


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
      refund_type: PREPAID_REFUND,
      mr_no: this.prepaidInfo.mr_no,
      org_id: this.orgId,
      admission_no: this.admissionNo,
      patient_id: 0,
      patient_name: this.prepaidInfo.patient_name,
      dob: '',
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

  addPaymentMode(){
    this.disabledAdd = true
    this.disabledSave = false
    this.disabledCancel = false
    this.readOnlyRefundAmount = false
    this.readOnlyPaymentMode = false
    this.readOnlyReason = false
    this.readOnlyNotes = false
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
