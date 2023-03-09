import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Invoice } from "../../../general/models/Invoice";
import { Patient } from "../../../general/models/Patient";
import { Payment } from "../../../general/models/Payment";
import { Payment_Settlement } from "../../../general/models/Payment_Settlement";
import { HttpParams } from "@angular/common/http";
import { PaymentLob } from 'src/app/general/models/PaymentLob';
import { PaymentMode, PaymentModePayment } from 'src/app/general/models/PaymentMode';
import { PaymentFormsService } from './payment-forms.service';
import { Cash } from 'src/app/general/models/div-card-payment/Cash';
import { Admission } from 'src/app/general/models/Admission';
import { SavePaymentRequest } from 'src/app/general/models/request/SavePaymentReq';
import { Edc } from 'src/app/general/models/div-card-payment/Edc';
import { Digital_Payment } from 'src/app/general/models/div-card-payment/Digital_Payment';
import { Bank_Transfer } from 'src/app/general/models/div-card-payment/Bank_Transfer';
import { SavePaymentUtils } from '../../../_helpers/SavePaymentUtils';
import { Payer } from 'src/app/general/models/div-card-payment/Payer';
import { Prepaid } from 'src/app/general/models/div-card-payment/Prepaid';
import { Giro } from 'src/app/general/models/div-card-payment/Giro';
import { PaymentRepository } from './payment-repository.service';
import { PaymentQuerySelectorService } from './payment-query-selector.service';
import { OrderedItemType } from 'src/app/general/models/OrderedItemType';
import { CombinedBill } from 'src/app/general/models/CombinedBill';
import { PaymentSearchAdmissionFormsService } from './payment-forms-search-admission.service';
import { AdmissionSubType } from 'src/app/general/models/AdmissionSubType';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalValidasiUserComponent } from 'src/app/general/general-modal/modal-validasi-user/modal-validasi-user.component';
import { ModalLargeConfig } from 'src/app/_configs/modal-config';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { SaveInvoiceOrderedItem } from 'src/app/general/models/request/SaveInvoiceReq';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss']
})
export class PaymentComponent implements OnInit {

  loadPage: boolean = true
  showSearchBillCard: boolean = false
  
  showCombinedBillCard: boolean = false
  loadCombinedBillCard: boolean = false

  showOrderedItemCard: boolean = false
  loadOrderedItemCard: boolean = false

  showPatientInfoCard: boolean = false
  loadPatientInfoCard: boolean = false

  showInputSalesDiscountCard: boolean = false

  showInvoiceCard: boolean = false
  loadInvoiceCard: boolean = false

  showPaymentCard: boolean = false
  showPaymentSettlementCard: boolean = false

  defaultLob: PaymentLob = PaymentLob.default()
  listLob: PaymentLob[] = []
  selectedLob: PaymentLob = this.defaultLob

  defaultAdmissionSubType: AdmissionSubType = AdmissionSubType.default()
  listAdmissionSubType: AdmissionSubType[] = []
  filteredListAdmissionSubType: AdmissionSubType[] = [this.defaultAdmissionSubType]
  selectedAdmissionSubType: AdmissionSubType = this.defaultAdmissionSubType

  admissionNo: string = ""

  admissionDateFrom: string = ""
  admissionDateTo: string = ""
  params: HttpParams = new HttpParams().set('page_no',1)
  search: boolean = false
  progress: boolean = false
  resetSelectPatient: boolean = false
  patientTypePayer: boolean = false

  selectPatientFormValid: boolean = false

  public admissionList: Admission[] = []
  public combinedBillList: CombinedBill[] = []
  public patientInfo: Patient = Patient.defaultWithoutMrNo()
  public orderedItem: OrderedItemType[] = []
  public saveInvoiceOrderedItem: SaveInvoiceOrderedItem[] = []
  public invoice: Invoice = Invoice.default()
  public payment: Payment = Payment.default()
  public paymentSettle: Payment_Settlement[] = []

  public readOnlyAmount: boolean = true
  public readOnlyPaymentMode: boolean = true
  public readOnlyAmountToSettled : boolean = true
  public readOnlySettleAmount : boolean = true
  public readOnlyBalance : boolean = true
  public readOnlyDeposit : boolean = true
  public readOnlyBank : boolean = true
  public readOnlyNet : boolean = true

  public disabledAdd: boolean = false
  public disabledSave: boolean = true
  public disabledCancel: boolean = true

  selectPatientRequired: boolean = true

  paymentModeList: PaymentMode[] = []
  paymentMode: PaymentModePayment = PaymentModePayment.default()
  selectedPaymentMode: PaymentMode = PaymentMode.default();
  formValid: PaymentModePayment = PaymentModePayment.default()
  
  cash: Cash = Cash.default()
  card: Edc = Edc.default()
  digitalPayment: Digital_Payment = Digital_Payment.default()
  bankTransfer: Bank_Transfer = Bank_Transfer.default()
  payer: Payer = Payer.default()
  prepaid: Prepaid = Prepaid.default()
  giro: Giro = Giro.default()

  shouldRecalculate: boolean = false

  savePaymentProgress: boolean = false

  settlement_no: string = ''
  paymentSettlementParams: HttpParams = new HttpParams().set("page_no", 1)

  bsModalUserValidation?: BsModalRef
  stateAdmissionNo: string = ''

  @ViewChild("appPayment", {read: ElementRef}) appPayment!: ElementRef

  constructor(
    private paymentRepository: PaymentRepository, 
    public fs: PaymentFormsService,
    public searchAdmissionForm: PaymentSearchAdmissionFormsService,
    private qs: PaymentQuerySelectorService,
    private bsModalService: BsModalService,
    private alertService: ModalAlertService) 
  {
    paymentRepository.component = this
    fs.component = this
    searchAdmissionForm.component = this
  }

  ngOnInit(): void {
    this.searchAdmissionForm.createForm()
    this.fs.createForm()
    this.paymentRepository.getList()

    if (history.state.admissionNo!='' && history.state.admissionNo!=undefined){
      this.stateAdmissionNo = history.state.admissionNo
      this.showSearchBillCard = true
      this.searchAdmissionForm.controls['admissionNo'].setValue(history.state.admissionNo)
      this.onChangeAdmissionNo(history.state.admissionNo)
      this.onValidateSearchAdmissionList()
    }else{
      this.admissionDateTo = this.searchAdmissionForm.getTodaysDate()
      this.admissionDateFrom = this.searchAdmissionForm.getTodaysDate()
    
      this.params = this.params.set("admission_date_to", this.admissionDateTo)
      this.params = this.params.set("admission_date_from", this.admissionDateFrom)
    }

  }

  saveInvoice(payment: Payment) {
    this.qs.element = this.appPayment
    this.qs.disableInputs()
    this.fs.controls["amount"].setValue(payment.amount)
    this.fs.controls["amount"].updateValueAndValidity()
    this.showPaymentCard = true;
  }

  onChangeLob(selected: PaymentLob) {
    this.selectedLob = selected

    this.searchAdmissionForm.controls["admissionSubType"].setValue(this.defaultAdmissionSubType)
    this.filteredListAdmissionSubType = [this.defaultAdmissionSubType]
    let value: string = ""
    if (this.selectedLob != null && this.selectedLob.key != "") {

      value = this.selectedLob.value;

      let subType: AdmissionSubType[] = this.listAdmissionSubType.filter(s => s.lob_id == Number(this.selectedLob.key));
      subType.forEach(s => {
        this.filteredListAdmissionSubType.push(s)
      })
    }
    this.params = this.params.set("admission_type", value)
  }

  onChangeAdmissionNo(admissionNo: string) {
    this.searchAdmissionForm.updateValidatorWhenAdmissionNoChange()
    this.admissionNo = admissionNo
    this.params = this.params.set('admission_no', this.admissionNo)
  }

  onChangeAdmissionSubType(selected: AdmissionSubType) {
    this.selectedAdmissionSubType = selected
    let value = this.selectedAdmissionSubType != null && 
      this.selectedAdmissionSubType.admission_sub_type_id != 0 ? this.selectedAdmissionSubType.admission_sub_type_name : ""
    this.params = this.params.set("admission_sub_type", value)
  }

  onChangeAdmissionDateFrom(admissionDateFrom: string) {
    this.admissionDateFrom = admissionDateFrom
    this.params = this.params.set("admission_date_from", this.admissionDateFrom)
  }

  onChangeAdmissionDateTo(admissionDateTo: string) { 
    this.admissionDateTo = admissionDateTo
    this.params = this.params.set("admission_date_to", this.admissionDateTo)
  }

  onChangePatientName(name: string) {
    this.params = this.params.set("patient_name", name)
  }

  onChangeMrNo(mrNo: number){
    this.params = this.params.set("mr_no", mrNo)
  }

  getPatientEvent(patient: Patient) {
    this.resetSelectPatient = false

    this.patientInfo.contact_no = patient.contact_no;
    this.patientInfo.deposit_amount = patient.deposit_amount;
    this.patientInfo.patient_id = patient.patient_id
    this.patientInfo.nationality_id = patient.nationality_id;
    
    if (patient.mr_no! > 0) this.params = this.params.set('mr_no', patient.mr_no!)
    else this.params = this.params.delete("mr_no");
  }

  onReset() {
    this.resetSelectPatient = true
    this.searchAdmissionForm.submitted = false
    this.searchAdmissionForm.reset()
    this.params = new HttpParams().set('page_no',1)
  }

  onValidateSearchAdmissionList() {
    this.searchAdmissionForm.submitted = true
    if (this.searchAdmissionForm.valid) {
      this.searchAdmissionList()
    }
  }
  
  searchAdmissionList(): void {
    this.paymentRepository.getAdmissionList();
  }

  admissionListChangeRadio(d: any, e: any): void {
    this.admissionList[this.admissionList.indexOf(d)].checked = e.target.checked;
  }

  admissionListSelectAll(e: any): void {
    this.admissionList.forEach((i: any) => {
      i.checked = e.target.checked;
    });
  }

  addBill(): void {
    this.showCombinedBillCard = true;
    this.loadCombinedBillCard = true;

    this.showInputSalesDiscountCard = true;

    this.admissionList.forEach((i: Admission) => {
      if(i.checked) {
        i.checked = false;
        let combinedBill = this.combinedBillList.find((c: any) => c.admission_no == i.admission_no);
        if (combinedBill == null) {
          let combinedBill: CombinedBill = CombinedBill.default()
          PropertyCopier.copyProperties(i, combinedBill)
          combinedBill.patient_id = this.patientInfo.patient_id!
          this.combinedBillList.push(combinedBill);
        }
      }
    });
    this.loadCombinedBillCard = false;
    this.paymentRepository.getAdmissionDetail();
    this.paymentRepository.getBilling();
  }
  
  removeBill() {
    this.paymentRepository.getAdmissionDetail()
    this.paymentRepository.getBilling()
  }

  updateBilling() {
    this.paymentRepository.getBilling();
  }

  recalculateBilling(data: any) {
    this.paymentRepository.processGetBilling(data);
  }

  addPaymentMode(): void {
    this.readOnlyAmount = false
    this.readOnlyPaymentMode = false;
    
    /*
    this.readOnlyAmountToSettled = false;
    this.readOnlySettleAmount = false;
    this.readOnlyBalance = false;
    this.readOnlyDeposit = false;
    this.readOnlyBank = false;
    this.readOnlyNet = false;
     */

    this.disabledAdd = true;
    this.disabledCancel = false;
    this.disabledSave = false;

    this.fs.controls["amount"].setValue(this.payment.balance)
  }

  cancelAddPaymentMode(): void {
    this.readOnlyPaymentMode = true;
    this.readOnlyAmountToSettled = true;
    this.readOnlySettleAmount = true;
    this.readOnlyBalance = true;
    this.readOnlyDeposit = true;
    this.readOnlyBank = true;
    this.readOnlyNet = true;

    this.disabledAdd = false;
    this.disabledCancel = true;
    this.disabledSave = true;

    // form.resetForm();
    this.fs.submitted = false;
    this.fs.reset();
    this.readOnlyAmount = true;
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
      if (prop == paymentModeName) {
        paymentMode[prop] = true;
        if (prop == "prepaid") {
          this.fs.controls["amount"].setValue('');
          this.fs.controls["amount"].updateValueAndValidity();
          this.readOnlyAmount = true;
        } else {
          this.readOnlyAmount = false;
        }
      }
      else paymentMode[prop] = false;
    }
    this.paymentMode = paymentMode;
  }

  onChangePaymentMode(selection: PaymentMode) {
    this.fs.submitted = false;
    if (selection == null) selection = { key: '', value: '' }
    
    // if payment mode from prepaid, set amount back
    if (this.selectedPaymentMode.key == "12") {
      this.fs.controls["amount"].setValue(this.invoice.patient_balance)
      this.fs.controls["amount"].updateValueAndValidity()
    }

    this.selectedPaymentMode = selection;
    
    this.readOnlyAmount = false;
    switch(selection.key){
      case "1":
        // Cash
        this.displayPaymentMode("cash");
        break;
      case "2":
        // Credit Card
        this.card.card_type = "Credit Card";
        this.displayPaymentMode("edc");
        break;
      case "3":
        // Debit Card
        this.card.card_type = "Debit Card";
        this.displayPaymentMode("edc");
        break;
      case "5":
        // Voucher
        this.displayPaymentMode("voucher");
        break;
      case "9":
        // Additional Payer
        this.displayPaymentMode("payer");
        break;
      case "10":
        // Digital Payment
        this.displayPaymentMode("digitalPayment");
        break;
      case "6":
        // Bank Transfer
        this.displayPaymentMode("bankTransfer");
        break;
      case "4":
        // Cheque
        this.displayPaymentMode("giro");
        break;
      case "11":
        // QRIS
        this.displayPaymentMode("qris");
        break;
      case "7":
        // Deposit
        this.displayPaymentMode("depositIpd");
        break;
      case "12":
        // Prepaid
        this.displayPaymentMode("prepaid");
        break;
      default:
        this.displayPaymentMode("");
        break;
    }
  }

  updateAmountFromPrepaid() {
    if (this.paymentMode.prepaid) {
      this.fs.controls["amount"].setValue(this.prepaid.amount);
    }
  }

  showModalUserValidation(body: SavePaymentRequest) {
    this.bsModalUserValidation = this.bsModalService.show(ModalValidasiUserComponent, ModalLargeConfig)
    this.bsModalUserValidation.content.isUserValid.subscribe((data: any) => {
      this.paymentRepository.savePayment(body);
    })
  }

  submitAddPayment(){
    this.fs.submitted = true
    let valid: boolean = false
    let body: SavePaymentRequest = {
      invoice_no: this.invoice.invoice_no,
      invoice_id: this.invoice.invoice_id,
      payment_mode_id: Number(this.selectedPaymentMode.key),
      amount: this.payment.amount,
      balance: this.payment.balance,
      notes: "",
    }

    switch (this.selectedPaymentMode.key) {
      case '1':
        SavePaymentUtils.cash(this.formValid, body, this.cash);
        valid = this.formValid.cash;
        break;
      case '2':
        // this.paymentRepository.getBankId(this.card.edc_id!);
        SavePaymentUtils.creditCard(this.formValid, body, this.card);
        valid = this.formValid.edc && this.card.paid_status;
        break;
      case '3':
        // this.paymentRepository.getBankId(this.card.edc_id!);
        SavePaymentUtils.debitCard(this.formValid, body, this.card);
        valid = this.formValid.edc && this.card.paid_status;
        break;
      case '4':
          SavePaymentUtils.chequeGiro(this.formValid, body, this.giro);
          valid = this.formValid.giro;
          break;
      case '6':
        SavePaymentUtils.bankTransfer(this.formValid, body, this.bankTransfer);
        valid = this.formValid.bankTransfer;
        break;
      case '9':
        SavePaymentUtils.additionalPayer(this.formValid, body, this.payer);
        valid = this.formValid.payer;
        break;
      case '10':
        SavePaymentUtils.digitalPayment(this.formValid, body, this.digitalPayment, 
          this.patientInfo);
        valid = this.formValid.digitalPayment && this.digitalPayment.paid_status;
        break;
      case '12':
        this.payment.amount = this.prepaid.amount;
        SavePaymentUtils.prepaid(this.formValid, body, this.prepaid);
        valid = this.formValid.prepaid;
        break;
    }

    if (this.fs.valid && valid) {
      this.alertService.showModalConfirm('Are you sure to save this payment?').content.isConfirm
      .subscribe((isConfirm: boolean) => {
        this.showModalUserValidation(body)
      })
    }
    
  }

  getPaymentSettle(){
    const params: HttpParams = new HttpParams().set("transaction_no", this.invoice.invoice_no)
    .set("transaction_type", "Payment").set("page_no", 1);
    this.paymentSettlementParams = params;
    this.showPaymentSettlementCard = true
  }
}
