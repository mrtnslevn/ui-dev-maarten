import { CombinedBill } from '../../../general/models/CombinedBill';
import { Component, OnInit } from '@angular/core';
import { Payment_Settlement } from 'src/app/general/models/Payment_Settlement';
import { ActivatedRoute, Router } from "@angular/router";
import { OrderedItemType } from "../../../general/models/OrderedItemType";
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { HttpParams } from '@angular/common/http';
import { InvoiceInquiryService } from 'src/app/service/invoice-inquiry.service';
import { GetCombinedBillResponse } from 'src/app/general/models/response/GetCombinedBillResponse';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { GetSalesDiscountResponse } from 'src/app/general/models/response/GetSalesDiscountResponse';
import { GetPaymentSettlementResponse } from 'src/app/general/models/response/GetPaymentSettlementResponse';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { Invoice } from 'src/app/general/models/Invoice';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { Patient } from 'src/app/general/models/Patient';
import { GetInvoiceDetailResponse } from 'src/app/general/models/response/GetInvoiceDetailResponse';
import { GetOrderedItemResponse } from 'src/app/general/models/response/GetOrderedItemResponse';
import { OrderedItem } from 'src/app/general/models/OrderedItem';

@Component({
  selector: 'app-payment-list-detail',
  templateUrl: './payment-list-detail.component.html',
  styleUrls: ['./payment-list-detail.component.scss']
})
export class PaymentListDetailComponent implements OnInit {

  public org_id: number = 0
  public combinedBill: Array<CombinedBill> = []
  public patientInformations: Patient = Patient.default()
  public invoice: Invoice = Invoice.default()
  public salesDiscount: any = []
  public paymentSettlementList: Array<Payment_Settlement> = []
  public paymentId: number = 0

  getParams: any
  params: any
  settlementNo: string = ''
  invoiceNo: string = ''

  public paymentDetail: any = {}
  public orderedItem: OrderedItemType[] = OrderedItemType.defaultArray()

  public disabledAdd: boolean = false
  public disabledSave: boolean = true
  public disabledCancel: boolean = true

  loadPage: boolean = true;
  data: any

  bsModalShowAlert?: BsModalRef
  getCombinedBillResponse!: GetCombinedBillResponse
  getInvoiceDetailResponse!: GetInvoiceDetailResponse
  getOrderedItemResponse!: GetOrderedItemResponse
  getSalesDiscountResponse!: GetSalesDiscountResponse
  getPaymentSettlementResponse!: GetPaymentSettlementResponse

  constructor(private paymentListService: InvoiceInquiryService, private route: ActivatedRoute,
    private token: TokenStorageService,
    private invoiceInquiryService: InvoiceInquiryService,
    private router: Router,
    private alertService: ModalAlertService) { }

  ngOnInit(): void {
    this.getParams = this.route.params.subscribe(params => {
      this.settlementNo = params['settlementNo'];
      this.invoiceNo = params['invoiceNo']
    })
    const userData = this.token.getUserData();
    this.org_id = userData.hope_organization_id;

    this.params = new HttpParams()
    .set('invoice_no', this.invoiceNo)
    .set('org_id', this.org_id)

    this.getCombinedBill()
    this.getPatientInformation()
    this.getSalesDiscount()
    this.getPaymentSettlement()
    this.getOrderedItem()
    this.getPaymentDetail()
  }

  getCombinedBill(){
    return this.paymentListService.getCombinedBill(this.params)
      .subscribe((data: GetCombinedBillResponse)=>
      {
        this.getCombinedBillResponse = {...data}
        if(this.getCombinedBillResponse.response_code == RESPONSE_SUCCESS){
          this.combinedBill = data.admission_list;
        }else{
          this.alertService.showModalAlert(`Failed to get combined bill: ${this.getCombinedBillResponse.response_desc}`,ALERT_DANGER) 
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get combined bill, please contact administration`, ALERT_DANGER)
      });
  }

  getPatientInformation(){
    return this.paymentListService.getPatientInformation(this.params)
      .subscribe((data: GetInvoiceDetailResponse)=>
      {
        this.getInvoiceDetailResponse = {...data}
        if(this.getInvoiceDetailResponse.response_code === RESPONSE_SUCCESS){
          this.patientInformations = PropertyCopier.clone(this.getInvoiceDetailResponse, this.patientInformations)
          this.invoice = PropertyCopier.clone(this.getInvoiceDetailResponse, this.invoice)
        }else{
          this.alertService.showModalAlert(`Failed to get patient information: ${this.getInvoiceDetailResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get patient information, please contact administration`, ALERT_DANGER)
      });
  }

  getSalesDiscount(){
    return this.paymentListService.getSalesDiscount(this.params)
      .subscribe((data: GetSalesDiscountResponse)=>
      {
        this.getSalesDiscountResponse = {...data}
        if(this.getSalesDiscountResponse.response_code === RESPONSE_SUCCESS){
          this.salesDiscount = data.sales_discount_list;
        }else{
          this.alertService.showModalAlert(`Failed to get sales discount: ${this.getSalesDiscountResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get sales discount, please contact administration`, ALERT_DANGER)
      });
  }

  getPaymentSettlement(){
    const params = new HttpParams()
    .set('transaction_no', this.invoiceNo)
    .set('transaction_type', "Payment")
    .set('org_id', this.org_id)
    .set('page_no',1)

    return this.paymentListService.getPaymentSettlement(params)
      .subscribe((data: GetPaymentSettlementResponse)=>
      {
        this.getPaymentSettlementResponse = {...data}
        if(this.getPaymentSettlementResponse.response_code === RESPONSE_SUCCESS){
          this.paymentSettlementList = data.payment_settlement_list;
        }else{
          this.alertService.showModalAlert(`Failed to get payment settlement: ${this.getPaymentSettlementResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get payment settlement, please contact administration`, ALERT_DANGER)
      });
  }

  getOrderedItem(){
    return this.paymentListService.getOrderedItem(this.params)
      .subscribe((data: GetOrderedItemResponse)=>
      {
        this.getOrderedItemResponse = {...data}
        if(this.getOrderedItemResponse.response_code === RESPONSE_SUCCESS){
          this.orderedItem = this.getOrderedItemResponse.sales_item_type_list;
          this.orderedItem.forEach((i: OrderedItemType) => {
            if(i.is_item_issue === '0'){
              i.sales_item_list.forEach((j: OrderedItem) => {
                j.checked = false;
              });
            }
          });
          this.invoice = PropertyCopier.clone(this.getOrderedItemResponse, this.invoice)
        }else{
          this.alertService.showModalAlert(`Failed to get ordered item: ${this.getOrderedItemResponse.response_desc}`,ALERT_DANGER)
        }
        this.loadPage = false;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get ordered item, please contact administration`, ALERT_DANGER)
        this.loadPage = false
      });
  }

  getPaymentDetail(){
    this.params = new HttpParams()
    .set('settlement_no', this.settlementNo)
    .set('org_id', this.org_id)

    return this.invoiceInquiryService.getPaymentDetail(this.params)
    .subscribe((data)=>
    {
      if(data.response_code == RESPONSE_SUCCESS){
        this.paymentDetail = data;
        this.paymentId = this.paymentDetail.payment_mode_id
        this.setDataDetail(this.paymentId,data)
      }else{
        this.alertService.showModalAlert(`Failed to get payment detail: ${data.response_desc}`,ALERT_DANGER)
      }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get payment detail, please contact administration`, ALERT_DANGER)
    });
  }

  setDataDetail(id: number, data: any){
    switch(id){
      case 1:
        this.data = data.cash
        this.data.notes = data.notes
        break;

      case 2:
      case 3:
        this.data = data.card
        this.data.notes = data.notes
        break;

      case 4:
        this.data = data.cheque_giro
        this.data.notes = data.notes
        break;

      case 5:
        this.data = data.voucher
        this.data.notes = data.notes
        this.data.amount = data.amount
        break;

      case 6:
        this.data = data.bank_transfer
        this.data.notes = data.notes
        break;

      case 7:
        this.data = data.deposit_ipd
        this.data.notes = data.notes
        break;

      case 9:
        this.data = data.additional_payer
        this.data.notes = data.notes
        break;

      case 10:
        this.data = data.digital_payment
        this.data.notes = data.notes
        break;

      case 11:
        this.data = data.qris
        this.data.notes = data.notes
        break;

      case 12:
        this.data = data.prepaid
        this.data.notes = data.notes
        break;
    }
  }

  back(){
    this.router.navigateByUrl("/payment/payment-list", { state: { fromDetail: true } });
  }

}
