import { Component, OnInit } from '@angular/core';
import { CombinedBill } from "../../../general/models/CombinedBill";
import { Payment_Settlement } from "../../../general/models/Payment_Settlement";
import { ActivatedRoute, Router } from "@angular/router";
import { OrderedItemType } from "../../../general/models/OrderedItemType";
import { HttpParams } from '@angular/common/http';
import { Sales_Discount } from 'src/app/general/models/Sales_Discount';
import { Patient } from 'src/app/general/models/Patient';
import { PaymentMode, PaymentModePayment } from 'src/app/general/models/PaymentMode';
import { Payment } from 'src/app/general/models/Payment';
import { SavePaymentRequest } from 'src/app/general/models/request/SavePaymentReq';
import { SavePaymentUtils } from 'src/app/_helpers/SavePaymentUtils';
import { Cash } from 'src/app/general/models/div-card-payment/Cash';
import { Edc } from 'src/app/general/models/div-card-payment/Edc';
import { Digital_Payment } from 'src/app/general/models/div-card-payment/Digital_Payment';
import { Bank_Transfer } from 'src/app/general/models/div-card-payment/Bank_Transfer';
import { Payer } from 'src/app/general/models/div-card-payment/Payer';
import { Prepaid } from 'src/app/general/models/div-card-payment/Prepaid';
import { Giro } from 'src/app/general/models/div-card-payment/Giro';
import { Invoice } from 'src/app/general/models/Invoice';
import { InvoiceListDetailRepository } from './invoice-list-detail-repository.service';
import { InvoiceListDetailFormsService } from './invoice-list-detail-forms.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalValidasiUserComponent } from 'src/app/general/general-modal/modal-validasi-user/modal-validasi-user.component';
import { ModalLargeConfig } from 'src/app/_configs/modal-config';

@Component({
  selector: 'app-invoice-list-detail',
  templateUrl: './invoice-list-detail.component.html',
  styleUrls: ['./invoice-list-detail.component.scss']
})
export class InvoiceListDetailComponent implements OnInit {

  loadPage: boolean = false

  loadCombinedBillCard: boolean = false
  loadPatientInfoCard: boolean = false
  loadOrderedItemCard: boolean = false
  loadInputSalesDiscountCard: boolean = false
  loadInvoiceCard: boolean = false

  showPaymentCard: boolean = false
  showPaymentSettlementCard: boolean = false;

  public combinedBill: CombinedBill[] = []
  public patientInfo: Patient = Patient.default()
  public orderedItem: OrderedItemType[] = OrderedItemType.defaultArray()
  public salesDiscount: Sales_Discount[] = []
  public invoice: Invoice = Invoice.default()
  public payment: Payment = Payment.default()
  public paymentSettlementList: Payment_Settlement[] = []
  
  getParams: any
  invoiceNo: string = ''
  params: any

  public paymentModeList: PaymentMode[] = []
  public selectedPaymentMode: PaymentMode = PaymentMode.default()

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

  paymentMode: PaymentModePayment = PaymentModePayment.default();
  formValid: PaymentModePayment = PaymentModePayment.default();

  cash: Cash = Cash.default();
  card: Edc = Edc.default();
  digitalPayment: Digital_Payment = Digital_Payment.default();
  bankTransfer: Bank_Transfer = Bank_Transfer.default();
  payer: Payer = Payer.default();
  prepaid: Prepaid = Prepaid.default();
  giro: Giro = Giro.default();

  savePaymentProgress: boolean = false;

  settlement_no: string = ''
  paymentSettlementParams: HttpParams = new HttpParams().set("page_no", 1);

  bsModalUserValidation?: BsModalRef

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public fs: InvoiceListDetailFormsService,
    private invoiceListDetailRepository: InvoiceListDetailRepository,
    private alertService: ModalAlertService,
    private bsModalService: BsModalService) 
  { 
    this.invoiceListDetailRepository.component = this;
    this.fs.component = this;
  }

  ngOnInit(): void {
    this.fs.createForm();
    this.getParams = this.route.params.subscribe(params => {
      this.invoiceNo = params['invoiceNo'];
    })

    this.params = new HttpParams()
    .set('invoice_no', this.invoiceNo)

    this.invoiceListDetailRepository.getPaymentMode()
    this.invoiceListDetailRepository.getCombinedBill()
    this.invoiceListDetailRepository.getPatientInformation()
    this.invoiceListDetailRepository.getOrderedItem()
    this.invoiceListDetailRepository.getSalesDiscount()
  }

  onChangePaymentAmount(amount: number) {
    const newPayment: Payment = {...this.payment};
    newPayment.amount = amount;
    newPayment.net = amount;
    this.payment = newPayment;
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

  showModalUserValidation(body: SavePaymentRequest) {
    this.bsModalUserValidation = this.bsModalService.show(ModalValidasiUserComponent, ModalLargeConfig)
    this.bsModalUserValidation.content.isUserValid.subscribe((data: any) => {
      this.invoiceListDetailRepository.savePayment(body);
    })
  }


  onChangePaymentMode(selection: PaymentMode) {
    this.fs.submitted = false;
    if (selection == null) selection = PaymentMode.default()
    
    // if payment mode from prepaid, set amount back
    if (this.selectedPaymentMode.key == "12") {
      this.fs.controls["amount"].setValue(this.invoice.patient_balance)
      this.fs.controls["amount"].updateValueAndValidity()
    }

    this.selectedPaymentMode = selection;
    
    this.readOnlyAmount = false;
    switch(selection.key) {
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
  
  loadPayment(payment: Payment) {
    this.fs.controls["amount"].setValue(payment.amount);
    this.fs.controls["amount"].updateValueAndValidity();
    
    this.showPaymentCard = true;
    this.showPaymentSettlementCard = true;
  }


  onValidateSavePayment() {
    if (confirm('Are you sure to save this payment?')) {
      this.fs.submitted = true;
      if (this.fs.valid) this.submitAddPayment();
    }
  }

  updateAmount() {
    if (this.paymentMode.prepaid) {
      this.fs.controls["amount"].setValue(this.prepaid.amount);
      this.fs.controls["amount"].updateValueAndValidity();
    }
  }
}
