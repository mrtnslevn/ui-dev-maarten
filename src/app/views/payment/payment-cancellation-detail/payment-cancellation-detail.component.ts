import { Component, OnInit } from '@angular/core';
import { CombinedBill } from 'src/app/general/models/CombinedBill';
import { Invoice } from 'src/app/general/models/Invoice';
import { Patient } from 'src/app/general/models/Patient';
import { Payment_Settlement } from 'src/app/general/models/Payment_Settlement';
import { Sales_Discount } from 'src/app/general/models/Sales_Discount';
import { PaymentCancellationService } from 'src/app/service/payment-cancellation.service';
import {ActivatedRoute, Router} from "@angular/router";
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalRejectReasonComponent } from 'src/app/general/general-modal/modal-reject-reason/modal-reject-reason.component';
import { ModalLargeConfig } from 'src/app/_configs/modal-config';
import { HttpParams } from '@angular/common/http';
import { InvoiceInquiryService } from 'src/app/service/invoice-inquiry.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { GetCombinedBillResponse } from 'src/app/general/models/response/GetCombinedBillResponse';
import { GetPaymentSettlementResponse } from 'src/app/general/models/response/GetPaymentSettlementResponse';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { OrderedItemType } from 'src/app/general/models/OrderedItemType';
import { GetOrderedItemResponse } from 'src/app/general/models/response/GetOrderedItemResponse';
import { GetSalesDiscountResponse } from 'src/app/general/models/response/GetSalesDiscountResponse';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { PropertyCopier } from 'src/app/_helpers/property-copier';

@Component({
  selector: 'app-payment-cancellation-detail',
  templateUrl: './payment-cancellation-detail.component.html',
  styleUrls: ['./payment-cancellation-detail.component.scss']
})
export class PaymentCancellationDetailComponent implements OnInit {
  paymentCancelDetail: any = {
    cancel_reason: '',
    cancelled_date: '',
    cancel_notes: '',
    cancelled_by: '',
  };

  dataCombinedBill: Array<CombinedBill> = []
  dataPatient: Patient = Patient.default() 
  dataInvoice: Invoice = Invoice.default()
  dataSalesDiscount: Array<Sales_Discount> = []
  dataPaymentSettlement: Array<Payment_Settlement> = []
  title: string = ""
  approve: boolean = false
  orderedItem: OrderedItemType[] = OrderedItemType.defaultArray()
  
  paymentDetail: any = {}
  bsModalReject?: BsModalRef
  bsModalShowAlert?: BsModalRef

  getParams: any
  params: any
  paymentCancellationId: string = ""
  invoiceNo: string = ''
  settlementNo: string = ''
  org_id: number = 0

  paymentId: number = 0
  data: any
  loadPage: boolean = true

  getCombinedBillResponse!: GetCombinedBillResponse
  getOrderedItemResponse!: GetOrderedItemResponse
  getSalesDiscountResponse!: GetSalesDiscountResponse
  getPaymentSettlementResponse!: GetPaymentSettlementResponse

  constructor(
    private paymentCancellationService: PaymentCancellationService,
    private invoiceInquiryService: InvoiceInquiryService,
    private token: TokenStorageService,
    private route: ActivatedRoute,
    private router: Router,
    public bsModalService: BsModalService,
    private alertService: ModalAlertService
  ) { }

  ngOnInit(): void {
    this.getParams = this.route.params.subscribe(params => {
      this.paymentCancellationId = params['paymentCancellationId'];
      this.invoiceNo = params['invoiceNo']
      this.settlementNo = params['settlementNo']
    })

    const userData = this.token.getUserData();
    this.org_id = userData.hope_organization_id;

    this.params = new HttpParams()
    .set('invoice_no', this.invoiceNo)
    .set('org_id', this.org_id)

    this.getDetailPayment();
    this.getDataCombinedBill();
    this.getPatientInfo();
    this.getOrderedItem();
    this.getSalesDiscount();
    this.getPaymentSettlement();
    this.getPaymentDetail()
  }

  getDetailPayment(){
    const params = new HttpParams()
    .set('payment_cancellation_id', this.paymentCancellationId)

    return this.paymentCancellationService.getDetail(params)
      .subscribe((data)=>
      {
        if(data.response_code === RESPONSE_SUCCESS){
          this.paymentCancelDetail.cancel_reason = data.cancel_reason,
          this.paymentCancelDetail.cancelled_date = data.cancelled_date,
          this.paymentCancelDetail.cancel_notes = data.cancel_notes,
          this.paymentCancelDetail.cancelled_by = data.cancelled_by
        }else{
          this.alertService.showModalAlert(`Failed to get detail payment: ${data.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while , please contact administration`, ALERT_DANGER)
      });
  }

  getDataCombinedBill(){
    return this.invoiceInquiryService.getCombinedBill(this.params)
      .subscribe((data: GetCombinedBillResponse)=>
      {
        this.getCombinedBillResponse = {...data}
        if(this.getCombinedBillResponse.response_code === RESPONSE_SUCCESS){
          this.dataCombinedBill = data.admission_list;
        }else{
          this.alertService.showModalAlert(`Failed to combined bill: ${this.getCombinedBillResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while combined bill, please contact administration`, ALERT_DANGER)
      });
  }

  getPatientInfo(){
    return this.invoiceInquiryService.getPatientInformation(this.params)
      .subscribe((data)=>
      {
        if(data.response_code === RESPONSE_SUCCESS){
          this.dataPatient = PropertyCopier.clone(data, this.dataPatient)
          this.dataInvoice = PropertyCopier.clone(data, this.dataInvoice)
          
        }else{
          this.alertService.showModalAlert(`Failed to get patient information: ${data.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get patient information , please contact administration`, ALERT_DANGER)
      });
  }

  getOrderedItem(){
    return this.invoiceInquiryService.getOrderedItem(this.params)
      .subscribe((data: GetOrderedItemResponse)=>
      {
        this.getOrderedItemResponse = {...data}
        if(this.getOrderedItemResponse.response_code === RESPONSE_SUCCESS){       
          this.orderedItem = data.sales_item_type_list;
          this.orderedItem.forEach((i: any) => {
            if(i.is_item_issue === '0'){
              i.sales_item_list.forEach((j: any) => {
                j.checked = false;
              });
            }
          });
        }else{
          this.alertService.showModalAlert(`Failed to get ordered item: ${this.getOrderedItemResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get ordered item, please contact administration`, ALERT_DANGER)
      });
  }

  getSalesDiscount(){
    return this.invoiceInquiryService.getSalesDiscount(this.params)
      .subscribe((data: GetSalesDiscountResponse)=>{
        this.getSalesDiscountResponse = {...data}
        if(this.getSalesDiscountResponse.response_code===RESPONSE_SUCCESS){
          this.dataSalesDiscount = data.sales_discount_list;
        }else{
          this.alertService.showModalAlert(`Failed to get sales discount: ${this.getSalesDiscountResponse.response_desc}`, ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get sales discount, please contact administration`, ALERT_DANGER)
      })
  }

  getPaymentSettlement(){
    const params = new HttpParams()
    .set('transaction_no', this.invoiceNo)
    .set('transaction_type', "Payment")
    .set('org_id', this.org_id)
    .set('page_no',1)

    return this.invoiceInquiryService.getPaymentSettlement(params)
      .subscribe((data:GetPaymentSettlementResponse)=>{
        this.getPaymentSettlementResponse = {...data}
        if(this.getPaymentSettlementResponse.response_code===RESPONSE_SUCCESS){
          this.dataPaymentSettlement = data.payment_settlement_list;
        }else{
          this.alertService.showModalAlert(`Failed to get payment settlement: ${this.getPaymentSettlementResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get payment settlemen, please contact administration`, ALERT_DANGER)
      })
  }

  showModalReject(approveType: string): void{
    //approve
    if(approveType == '1'){
      this.title = "Approved"
      this.approve = true
    }else{
      this.title = "Rejected"
      this.approve = false
    };

    const initialState: ModalOptions = {
      initialState: {
        title: this.title,
        approve: this.approve,
        statusPage: "payment",
        id: this.paymentCancellationId
      },
    };
    this.bsModalReject = this.bsModalService.show(ModalRejectReasonComponent, Object.assign(ModalLargeConfig, initialState))
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
    this.loadPage = false
  }

  back(){
    this.router.navigateByUrl("/payment/approval-for-payment-cancellation", { state: { fromDetail: true } });
  }
}
