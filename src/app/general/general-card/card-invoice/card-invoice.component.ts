import { ALERT_SUCCESS } from './../../../_configs/app-config';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Invoice } from "../../models/Invoice";
import { Payment } from "../../models/Payment";
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { GeneralService } from 'src/app/service/general.service';
import { PaymentService } from 'src/app/service/payment.service';
import { ALERT_DANGER, ALERT_WARNING, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { CardInvoiceFormsService } from './card-invoice-forms.service';
import { Patient } from '../../models/Patient';
import { CombinedBill } from '../../models/CombinedBill';
import { OrderedItemType } from '../../models/OrderedItemType';
import { GetListResponse } from '../../models/response/GetListResponse';
import { GetBillingRequest } from '../../models/request/GetBillingReq';
import { GetBillingResponse } from '../../models/response/GetBillingResponse';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { SaveInvoiceOrderedItem, SaveInvoiceRequest } from '../../models/request/SaveInvoiceReq';
import { SaveInvoiceResponse } from '../../models/response/SaveInvoiceResponse';
import { DiscountType } from '../../models/DiscountType';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalDefaultConfig, ModalLargeConfig } from 'src/app/_configs/modal-config';
import { ModalSendPrintComponent } from '../../general-modal/modal-send-print/modal-send-print.component';
import { ModalAlertConfirmComponent } from '../../general-modal/modal-alert-confirm/modal-alert-confirm.component';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ChangePayerRequest } from '../../models/request/ChangePayerReq';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ChangePayerResponse } from '../../models/response/ChangePayerResponse';
import { ComboBox } from '../../models/ComboBox';
import { GetInvoiceResponse } from '../../models/response/GetInvoiceResponse';
import { ModalValidasiUserComponent } from '../../general-modal/modal-validasi-user/modal-validasi-user.component';
import { GetCoverageRequestApprovalResponse } from '../../models/response/GetCoverageRequestApprovalResponse';
import { CoverageRequestApproval } from '../../models/CoverageRequestApproval';

@Component({
  selector: 'app-card-invoice',
  templateUrl: './card-invoice.component.html',
  styleUrls: ['./card-invoice.component.scss']
})
export class CardInvoiceComponent implements OnInit, OnDestroy {

  @Input() loadPage: boolean = false;
  @Input() show: boolean = true

  private _data: Invoice = Invoice.default();
  @Input() set data(value: Invoice) {
    this._data = value;
  }

  get data(): Invoice {
    return this._data;
  }

  @Input() paymentData: Payment = Payment.default();

  @Input() payment: boolean = false;
  @Input() showFooter: boolean = false;
  @Input() disableDiscount: boolean = false;
  @Input() showPrintButton: boolean = false;

  @Input() combinedBillList: CombinedBill[] = [];
  @Input() orderedItemList: OrderedItemType[] = [];
  @Input() saveInvoiceOrderedItem: SaveInvoiceOrderedItem[] = []
  @Input() patientInfo: Patient = Patient.default();

  public _patientTypePayer: boolean = false
  @Input() set patientTypePayer(value: boolean) {
    this._patientTypePayer = value
    if (this.patientTypePayer) {
      this.fs.controls["limitTypePayer"].enable()
      this.fs.controls["discountTypePayer"].enable()
    } else {
      this.fs.controls["limitTypePayer"].disable()
      this.fs.controls["discountTypePayer"].disable()
    }
  }

  get patientTypePayer() {
    return this._patientTypePayer
  }

  @Output() dataChange = new EventEmitter<Invoice>();
  @Output() paymentDataChange = new EventEmitter<Payment>();
  @Output() saveInvoice = new EventEmitter<Payment>();
  @Output() loadPaymentEvent = new EventEmitter<Payment>();

  @Input() shouldRecalculate: boolean = false
  @Output() shouldRecalculateChange = new EventEmitter<boolean>()

  @Output() recalculate = new EventEmitter<GetBillingResponse>()

  disableDiscountFactorPayer: boolean = true
  disableDiscountFactorPatient: boolean = true
  disableLimitTypePayer: boolean = true

  listDiscountType: DiscountType[] = [];
  listLimitType: ComboBox[] = []

  recalculatingProgress: boolean = false;
  saveInvoiceProgress: boolean = false;
  printInvoiceProgress: boolean = false;

  invoiceSaved: boolean = false;

  bsModal?: BsModalRef;
  bsModalShowAlert?: BsModalRef
  bsModalShowAlertConfirm?: BsModalRef
  bsModalUserValidation?: BsModalRef

  getListResponse!: GetListResponse
  getBillingResponse!: GetBillingResponse
  saveInvoiceResponse!: SaveInvoiceResponse
  changePayerResponse!: ChangePayerResponse
  getInvoiceResponse!: GetInvoiceResponse
  getCoverageRequestApprovalResponse!: GetCoverageRequestApprovalResponse

  orgId: number = 0
  hopeUserId: number = 0
  @Input() disabledForm: boolean = false

  coverageRequestApproval: CoverageRequestApproval[] = []
  totalCmsCoverage: number = 0

  constructor(private generalService: GeneralService, private paymentService: PaymentService,
    public fs: CardInvoiceFormsService, private bsModalService: BsModalService,
    private alertService: ModalAlertService,
    private token: TokenStorageService) {
      if(!this.disabledForm) {
        this.fs.createForm();
      }
    }

  ngOnInit(): void {
    this.getDiscountType();

    const userData = this.token.getUserData()
    this.orgId = userData.hope_organization_id
    this.hopeUserId = userData.hope_user_id
  }

  ngOnDestroy(): void {
    this.fs.reset()
  }

  showModalConfirm(message: string){
    const initialState: ModalOptions = {
      initialState: {
        message: message,
      },
    };
    this.bsModalShowAlertConfirm = this.bsModalService.show(ModalAlertConfirmComponent, Object.assign(ModalDefaultConfig, initialState))
    return this.bsModalShowAlertConfirm.content.isConfirm
  }

  getDiscountType() {
    this.loadPage = true;

    let params: HttpParams = new HttpParams().set("param_list", "invoiceDiscountTypeList")
    .append("param_list", "limitTypeList")
    this.generalService.getListWithParam(params).subscribe((data: GetListResponse) => {
      this.getListResponse = {...data}
      if (this.getListResponse.response_code == RESPONSE_SUCCESS) {
        this.listDiscountType = this.getListResponse.discountTypeList;
        this.listLimitType = this.getListResponse.limitTypeList
      }else{
        this.alertService.showModalAlert(`Failed to get discount type list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadPage = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get discount type list, please contact administration`, ALERT_DANGER)
      this.loadPage = false;
    })
  }

  onChangePayerLimitType(selected: ComboBox) {
    this.data.payer_limit_factor = 0
    this.data.patient_limit = 0
    this.data.cms_patient_limit_factor = 0
    this.data.cms_payer_limit_factor = 0
    if (selected != null) {
      this.data.payer_limit_type = selected.key
      if (selected.key == "1") {
        this.fs.controls["limitFactorPayer"].reset()
        this.fs.controls["limitFactorPayer"].disable()
        return
      }else if(selected.key == "5"){
        this.getCoverageRequestApproval()
      }
      this.fs.controls["limitFactorPayer"].enable()
      return
    }
    // this.fs.controls["limitFactorPayer"].reset()
    // this.fs.controls["limitFactorPayer"].disable()
  }

  getCoverageRequestApproval(){
    let params: HttpParams = new HttpParams()
    .set("organization_id", 19)

    this.combinedBillList.forEach(c => {
      params = params.append("admission_nos", c.admission_no!)
    })
    // .set("admission_nos", this.patientInfo.admission_no!)

    this.paymentService.getCoverageRequestApproval(params).subscribe((data: GetCoverageRequestApprovalResponse) => {
      if (data.response_code == RESPONSE_SUCCESS) {
        this.getCoverageRequestApprovalResponse = {...data}
        this.fs.controls["limitFactorPayer"].setValue(this.getCoverageRequestApprovalResponse.approved_coverage_payer)
        this.data.patient_limit = this.getCoverageRequestApprovalResponse.approved_coverage_patient
        this.totalCmsCoverage = this.getCoverageRequestApprovalResponse.approved_coverage_patient + this.getCoverageRequestApprovalResponse.approved_coverage_payer
        this.data.cms_patient_limit_factor = this.getCoverageRequestApprovalResponse.approved_coverage_patient
        this.data.cms_payer_limit_factor = this.getCoverageRequestApprovalResponse.approved_coverage_payer
      }else{
        this.alertService.showModalAlert(`Failed to get coverage request approval: ${this.getCoverageRequestApprovalResponse.response_desc}`,ALERT_DANGER)
      }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get coverage request approval, please contact administration`, ALERT_DANGER)
    })
  }

  onChangePayerDiscountType(selected: DiscountType) {
    if (selected != null) {
      this.data.payer_discount_type = selected.key;
      if (selected.key == "1") {
        this.fs.controls["discountFactorPayer"].reset()
        this.fs.controls["discountFactorPayer"].disable()
        return
      }
      this.fs.controls["discountFactorPayer"].enable()
      return
    }
    this.fs.controls["discountFactorPayer"].reset()
    this.fs.controls["discountFactorPayer"].disable()
  }

  onChangePayerDiscountFactor(factor: number) {
    this.data.payer_discount_factor = factor
  }

  onChangePayerLimitFactor(limitFactor: number) {
    this.data.payer_limit_factor = limitFactor
    // if(this.totalCmsCoverage - this.data.payer_limit_factor<0){
    //   this.data.patient_limit = 0
    // }else{
    //   this.data.patient_limit = this.totalCmsCoverage - this.data.payer_limit_factor
    // }
  }

  onChangePatientDiscountType(selected: DiscountType) {
    if (selected != null) {
      this.data.patient_discount_type = selected.key;
      if (selected.key == "1") {
        this.fs.controls["discountFactorPatient"].reset()
        this.fs.controls["discountFactorPatient"].disable()
        return
      }
      this.fs.controls["discountFactorPatient"].enable()
      return
    }
    this.fs.controls["discountFactorPatient"].reset()
    this.fs.controls["discountFactorPatient"].disable()
  }

  onChangePatientDiscountFactor(factor: number) {
    this.data.patient_discount_factor = factor
  }

  changePayer() {
    let req: ChangePayerRequest = {
      admission_id: this.patientInfo.admission_id!,
      mr_no: this.patientInfo.mr_no!,
      user_id: this.hopeUserId,
      payer_id: this.patientInfo.payer_id!,
      eligibility_no: this.patientInfo.eligibility_no!,
      payer_id_no: this.patientInfo.payer_id_no!,
      patient_type_id: this.patientInfo.patient_type_id!,
      organization_id: this.orgId
    }
    this.paymentService.changePayer(req)
    .subscribe((data: ChangePayerResponse) => {
      this.changePayerResponse = {...data}
      if (this.changePayerResponse.response_code == RESPONSE_SUCCESS) {
        this.getBilling()
      } else {
        this.loadPage = false
        this.recalculatingProgress = false
        this.alertService.showModalAlertError(`Failed to change payer: ${this.changePayerResponse.response_desc}`);
      }
    }, err => {
      this.loadPage = false;
      this.recalculatingProgress = false;
      if (this.changePayerResponse.response_desc != undefined) {
        this.alertService.showModalAlertError(`Failed to change payer: ${this.changePayerResponse.response_desc}`)
      } else {
        this.alertService.showModalAlertError(`Failed to change payer. Please contact administration`)
      }
    })
  }

  getBilling() {
    let req: GetBillingRequest = {
      admission_list: this.combinedBillList,
      // payer_discount_type_id: Number(this.data.payer_discount_type),
      // payer_discount_factor: this.data.payer_discount_factor,
      // patient_discount_type_id: Number(this.data.patient_discount_type),
      // patient_discount_factor: this.data.patient_discount_factor
    }
    this.paymentService.getBilling(req).subscribe((data: GetBillingResponse) => {
      this.getBillingResponse = {...data}
      if (this.getBillingResponse.response_code == RESPONSE_SUCCESS) {
        PropertyCopier.copyProperties(this.getBillingResponse, this.data);
        this.shouldRecalculate = false

        this.shouldRecalculateChange.emit(this.shouldRecalculate)
        this.dataChange.emit(this.data);
        this.recalculate.emit(this.getBillingResponse)
      } else {
        this.alertService.showModalAlert(`Failed to recalculate data: ${this.getBillingResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadPage = false
      this.recalculatingProgress = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while recalculate data, please contact administration`, ALERT_DANGER)
      this.loadPage = false
      this.recalculatingProgress = false;
    })
  }

  recalculating() {
    this.loadPage = true;
    this.recalculatingProgress = true;

    this.changePayer()
  }

  loadPayment() {
    this.paymentData.amount_to_settled = this.data.patient_net;
    this.paymentData.settle_amount = this.data.patient_net - this.data.patient_balance;
    this.paymentData.balance = this.data.patient_balance;
    this.paymentData.deposit_balance = this.patientInfo.deposit_amount!;
    this.paymentData.amount = this.data.patient_balance;
    this.paymentDataChange.emit(this.paymentData);
    this.loadPaymentEvent.emit(this.paymentData);
  }

  onValidateSaveInvoice() {
    this.fs.submitted = true
    if (this.fs.valid) {
      this.showModalConfirm('Are you sure to save this invoice?').subscribe((item: any)=>{
        if (this.shouldRecalculate) {
          this.alertService.showModalAlert("Recalculate billing first",ALERT_WARNING)
          return;
        }
        this.showModalUserValidation();
      })
    }
  }

  showModalUserValidation() {
    this.bsModalUserValidation = this.bsModalService.show(ModalValidasiUserComponent, ModalLargeConfig)
    this.bsModalUserValidation.content.isUserValid.subscribe((data: any) => {
      this.save()
    })
  }

  // async getInvoice(invoiceId: number) {
  //   const params = new HttpParams().set("organization_id", this.orgId).set("ar_invoice_id", invoiceId)
  //   await firstValueFrom(this.paymentService.getInvoice(params)).then((data: GetInvoiceResponse) => {
  //     this.getInvoiceResponse = {...data}
  //     if (this.getInvoiceResponse.response_code == RESPONSE_SUCCESS) {
  //       // Payer
  //       this.data.payer_gross = this.getInvoiceResponse.payer_gross_amount
  //       this.data.payer_admin = this.getInvoiceResponse.payer_admin_fee
  //       this.data.payer_limit_type = this.getInvoiceResponse.payer_limit_type_id.toString()
  //       let payerLimitType: ComboBox = this.listLimitType.find(l => l.key == this.data.payer_limit_type)!
  //       this.fs.controls["limitTypePayer"].setValue(payerLimitType)

  //       this.data.payer_limit_factor = this.getInvoiceResponse.payer_limit_numeric_factor
  //       this.fs.controls["limitFactorPayer"].setValue(this.data.payer_limit_factor)

  //       this.data.payer_limit = this.getInvoiceResponse.payer_limit_amount
  //       this.data.payer_discount_type = this.getInvoiceResponse.payer_discount_type_id.toString()
  //       let payerDiscountType: DiscountType = this.listDiscountType.find(d => d.key == this.data.payer_discount_type)!
  //       this.fs.controls["discountTypePayer"].setValue(payerDiscountType)

  //       this.data.payer_discount_factor = this.getInvoiceResponse.payer_discount_numeric_factor
  //       this.fs.controls["discountFactorPayer"].setValue(this.data.payer_discount_factor)

  //       this.data.payer_discount = this.getInvoiceResponse.payer_discount_amount
  //       this.data.payer_net = this.getInvoiceResponse.payer_net_amount
  //       this.data.payer_balance = this.getInvoiceResponse.payer_balance_amount

  //       // Patient
  //       this.data.patient_gross = this.getInvoiceResponse.patient_gross_amount
  //       this.data.patient_admin = this.getInvoiceResponse.patient_admin_fee
  //       this.data.patient_limit = this.getInvoiceResponse.patient_limit_amount
  //       this.data.patient_discount_type = this.getInvoiceResponse.patient_discount_type_id.toString()
  //       let patientDiscountType: DiscountType = this.listDiscountType.find(d => d.key == this.data.patient_discount_type)!
  //       this.fs.controls["discountTypePatient"].setValue(patientDiscountType)

  //       this.data.patient_discount_factor = this.getInvoiceResponse.patient_discount_numeric_factor
  //       this.fs.controls["discountFactorPatient"].setValue(this.data.patient_discount_factor)

  //       this.data.patient_discount = this.getInvoiceResponse.patient_discount_amount
  //       this.data.patient_net = this.getInvoiceResponse.patient_net_amount
  //       this.data.patient_balance = this.getInvoiceResponse.patient_balance_amount

  //       // Invoice
  //       this.data.total_gross = this.getInvoiceResponse.invoice_gross_amount
  //       this.data.total_discount = this.getInvoiceResponse.invoice_discount_amount
  //       this.data.total_admin = this.getInvoiceResponse.invoice_admin_fee
  //       this.data.total_rounding = this.getInvoiceResponse.invoice_round_amount
  //       this.data.total_net = this.getInvoiceResponse.invoice_net_amount
  //       this.data.total_balance = this.getInvoiceResponse.invoice_balance_amount
  //     }
  //   }, err => {
  //     this.alertService.showModalAlertError(`Failed to Get Invoice with Invoice ID: ${invoiceId}`);
  //   })
  // }

  save(): void {
    this.saveInvoiceProgress = true;

    let ordered_item_list: SaveInvoiceOrderedItem[] = this.saveInvoiceOrderedItem;

    let req: SaveInvoiceRequest = {
      combined_bill_list: this.combinedBillList,
      invoice: this.data,
      main_admission: this.patientInfo,
      ordered_item_list: ordered_item_list,
      patient_discount_type_id: Number(this.data.patient_discount_type),
      patient_discount_numeric_factor: this.data.patient_discount_factor != undefined ? this.data.patient_discount_factor : 0,
      // patient_discount_amount: this.data.patient_discount!,
      payer_discount_type_id: Number(this.data.payer_discount_type),
      payer_discount_numeric_factor: this.data.payer_discount_factor != undefined ? this.data.payer_discount_factor : 0,
      // payer_discount_amount: this.data.payer_discount!,
      notes: this.patientInfo.notes!,
      contact_no: this.patientInfo.contact_no!,
      // TODO: Change it later
      promotion_code: ""
    }
    console.log(req)
    this.paymentService.saveInvoice(req).subscribe((data: SaveInvoiceResponse) => {
      this.saveInvoiceResponse = {...data}
      if (this.saveInvoiceResponse.response_code == RESPONSE_SUCCESS) {
        this.fs.submitted = false
        this.disabledForm = true
        this.fs.reset()

        this.data.invoice_no = this.saveInvoiceResponse.invoice_no;
        this.data.invoice_id = this.saveInvoiceResponse.invoice_id;
        this.data.invoice_date = this.saveInvoiceResponse.invoice_date;

        this.data.payer_gross = this.saveInvoiceResponse.payer_gross_amount
        this.data.payer_admin = this.saveInvoiceResponse.payer_admin_fee

        this.data.payer_limit_type = this.saveInvoiceResponse.payer_limit_type_name

        this.data.payer_limit_factor = this.saveInvoiceResponse.payer_limit_numeric_factor

        this.data.payer_limit = this.saveInvoiceResponse.payer_limit_amount
        this.data.payer_discount_type = this.saveInvoiceResponse.payer_discount_type_name

        this.data.payer_discount_factor = this.saveInvoiceResponse.payer_discount_numeric_factor

        this.data.payer_discount = this.saveInvoiceResponse.payer_discount_amount
        this.data.payer_net = this.saveInvoiceResponse.payer_net_amount
        this.data.payer_balance = this.saveInvoiceResponse.payer_balance_amount

        // Patient
        this.data.patient_gross = this.saveInvoiceResponse.patient_gross_amount
        this.data.patient_admin = this.saveInvoiceResponse.patient_admin_fee
        this.data.patient_limit = this.saveInvoiceResponse.patient_limit_amount
        this.data.patient_discount_type = this.saveInvoiceResponse.patient_discount_type_name

        this.data.patient_discount_factor = this.saveInvoiceResponse.patient_discount_numeric_factor

        this.data.patient_discount = this.saveInvoiceResponse.patient_discount_amount
        this.data.patient_net = this.saveInvoiceResponse.patient_net_amount
        this.data.patient_balance = this.saveInvoiceResponse.patient_balance_amount

        // Invoice
        this.data.total_gross = this.saveInvoiceResponse.invoice_gross_amount
        this.data.total_discount = this.saveInvoiceResponse.invoice_discount_amount
        this.data.total_admin = this.saveInvoiceResponse.invoice_admin_fee
        this.data.total_rounding = this.saveInvoiceResponse.invoice_round_amount
        this.data.total_net = this.saveInvoiceResponse.invoice_net_amount
        this.data.total_balance = this.saveInvoiceResponse.invoice_balance_amount

        this.paymentData.amount_to_settled = this.data.patient_net;
        this.paymentData.balance = this.data.patient_balance;
        this.paymentData.deposit_balance = this.patientInfo.deposit_amount!;
        this.paymentData.amount = this.data.patient_balance;
        this.paymentDataChange.emit(this.paymentData);

        this.invoiceSaved = true;
        this.saveInvoice.emit(this.paymentData);
        this.alertService.showModalAlert('Save invoice successfully', ALERT_SUCCESS);
      } else {
        this.alertService.showModalAlert(`Failed to save invoice: ${this.saveInvoiceResponse.response_desc}`,ALERT_DANGER)
      }
      this.saveInvoiceProgress = false;
    }, (err: HttpErrorResponse) => {
      this.saveInvoiceResponse = err.error
      if (this.saveInvoiceResponse.response_desc != undefined) {
        this.alertService.showModalAlert(`Failed to save invoice: ${this.saveInvoiceResponse.response_desc}`, ALERT_DANGER)
      } else {
        this.alertService.showModalAlert(`An error has occured while save invoice, please contact administration`, ALERT_DANGER)
      }
      
      this.saveInvoiceProgress = false;
    })
  }

  showSendPrintModal() {
    const initialState: ModalOptions = {
      initialState: {
        patientInfo: this.patientInfo,
        invoice: this.data,
        orderedItemList: this.orderedItemList,
        whatsapp: this.patientInfo.contact_no,
        email: this.patientInfo.email,
        type: this.payment ? 'payment' : 'prepaid',
        id: this.data.invoice_no,
        print_type: 'sementara'
      },
    };
    this.bsModal = this.bsModalService.show(ModalSendPrintComponent, Object.assign(ModalLargeConfig, initialState));
  }
}
