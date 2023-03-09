import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalRejectReasonComponent } from 'src/app/general/general-modal/modal-reject-reason/modal-reject-reason.component';
import { CombinedBill } from 'src/app/general/models/CombinedBill';
import { Invoice } from 'src/app/general/models/Invoice';
import { OrderedItemType } from 'src/app/general/models/OrderedItemType';
import { Patient } from 'src/app/general/models/Patient';
import { Payment_Settlement } from 'src/app/general/models/Payment_Settlement';
import { GetCombinedBillResponse } from 'src/app/general/models/response/GetCombinedBillResponse';
import { GetOrderedItemResponse } from 'src/app/general/models/response/GetOrderedItemResponse';
import { GetPaymentSettlementResponse } from 'src/app/general/models/response/GetPaymentSettlementResponse';
import { GetSalesDiscountResponse } from 'src/app/general/models/response/GetSalesDiscountResponse';
import { Sales_Discount } from 'src/app/general/models/Sales_Discount';
import { InvoiceCancellationService } from 'src/app/service/invoice-cancellation.service';
import { InvoiceInquiryService } from 'src/app/service/invoice-inquiry.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import {  ModalLargeConfig } from 'src/app/_configs/modal-config';
import { PropertyCopier } from 'src/app/_helpers/property-copier';

@Component({
  selector: 'app-invoice-cancellation-detail',
  templateUrl: './invoice-cancellation-detail.component.html',
  styleUrls: ['./invoice-cancellation-detail.component.scss']
})
export class InvoiceCancellationDetailComponent implements OnInit {
  cancelReason: any = {
    cancel_reason: '',
    cancelled_date: '',
    cancel_notes: '',
    cancelled_by: '',
  }
  dataCombinedBill: Array<CombinedBill> = []
  dataPatient: Patient = Patient.default()
  dataInvoice: Invoice = Invoice.default()
  dataSalesDiscount: Array<Sales_Discount> = []
  dataPaymentSettlement: Array<Payment_Settlement> = []
  orderedItem: OrderedItemType[] = [];

  getCombinedBillResponse!: GetCombinedBillResponse
  getOrderedItemResponse!: GetOrderedItemResponse
  getSalesDiscountResponse!: GetSalesDiscountResponse
  getPaymentSettlementResponse!: GetPaymentSettlementResponse

  title: string = ""
  approve: boolean = false

  bsModalReject?: BsModalRef
  bsModalShowAlert?: BsModalRef

  loadPage: boolean = true
  getParams: any
  params: any
  invoiceNo: string = ""
  invCancellationId: string = ''
  public org_id: number = 0

  constructor(
    private invoiceCancellationService: InvoiceCancellationService,
    private invoiceService: InvoiceInquiryService,
    public bsModalService: BsModalService,
    private route: ActivatedRoute,
    private router: Router,
    private token: TokenStorageService,
    private alertService: ModalAlertService) { }

  ngOnInit(): void {
    this.getParams = this.route.params.subscribe(params => {
      this.invoiceNo = params['invoiceNo'];
      this.invCancellationId = params ['invCancellationId']
    })

    const userData = this.token.getUserData();
    this.org_id = userData.hope_organization_id;

    this.params = new HttpParams()
    .set('invoice_no', this.invoiceNo)
    .set('org_id', this.org_id)

    this.getDetailInvoice();
    this.getDataCombinedBill();
    this.getPatientInfo();
    this.getSalesDiscount();
    this.getPaymentSettlement();
  }

  getDetailInvoice(){
    const params = new HttpParams()
    .set('inv_cancellation_id', this.invCancellationId)

    return this.invoiceCancellationService.getDetail(params)
      .subscribe((data)=>
      {
        if(data.response_code === RESPONSE_SUCCESS){
          this.cancelReason.cancel_reason = data.cancel_reason,
          this.cancelReason.cancelled_date = data.cancelled_date,
          this.cancelReason.cancel_notes = data.cancel_notes,
          this.cancelReason.cancelled_by = data.cancelled_by
        }
        else{
          this.alertService.showModalAlert(`Failed to get invoice detail: ${data.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get invoice detail, please contact administration`, ALERT_DANGER)
      });
  }

  getDataCombinedBill(){
    return this.invoiceService.getCombinedBill(this.params)
      .subscribe((data: GetCombinedBillResponse)=>
      {
        this.getCombinedBillResponse = {...data}
        if(this.getCombinedBillResponse.response_code == RESPONSE_SUCCESS){
          this.dataCombinedBill = data.admission_list;
        }else{
          this.alertService.showModalAlert(`Failed to get combined bill list: ${this.getCombinedBillResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get combined bill list, please contact administration`, ALERT_DANGER)
      });
  }

  getOrderedItem(){
    return this.invoiceService.getOrderedItem(this.params)
      .subscribe((data: GetOrderedItemResponse)=>
      {
        this.getOrderedItemResponse = {...data}
        if(this.getOrderedItemResponse.response_code===RESPONSE_SUCCESS){
          this.orderedItem = data.sales_item_type_list;
          this.orderedItem.forEach((i: any) => {
            if(i.is_item_issue === '0'){
              i.sales_item_list.forEach((j: any) => {
                j.checked = false;
              });
            }
          });
        }else{
          this.alertService.showModalAlert(`Failed to get ordered item list: ${this.getOrderedItemResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get ordered item list, please contact administration`, ALERT_DANGER)
      });
  }

  getPatientInfo(){
    return this.invoiceService.getPatientInformation(this.params)
      .subscribe((data)=>
      {
        if(data.response_code === RESPONSE_SUCCESS){
          this.dataPatient = PropertyCopier.clone(data, this.dataPatient)
          this.dataInvoice = PropertyCopier.clone(data, this.dataInvoice)
        }else{
          this.alertService.showModalAlert(`Failed to get detail information: ${data.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get detail information, please contact administration`, ALERT_DANGER)
      });
  }

  getSalesDiscount(){
    return this.invoiceService.getSalesDiscount(this.params)
      .subscribe((data: GetSalesDiscountResponse)=>{
        this.getSalesDiscountResponse = {...data}
        if(this.getSalesDiscountResponse.response_code===RESPONSE_SUCCESS){
          this.dataSalesDiscount = data.sales_discount_list;
        }else{
          this.alertService.showModalAlert(`Failed to get sales discount data: ${this.getSalesDiscountResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get sales discount data, please contact administration`, ALERT_DANGER)
      })
  }

  getPaymentSettlement(){
    const params = new HttpParams()
    .set('transaction_no', this.invoiceNo)
    .set('transaction_type', "Payment")
    .set('org_id', this.org_id)
    .set('page_no',1)

    return this.invoiceService.getPaymentSettlement(params)
      .subscribe((data: GetPaymentSettlementResponse)=>{
        this.getPaymentSettlementResponse = {...data}
        if(this.getPaymentSettlementResponse.response_code===RESPONSE_SUCCESS){
          this.dataPaymentSettlement = data.payment_settlement_list;
        }else{
          this.alertService.showModalAlert(`Failed to get payment settlement list: ${this.getPaymentSettlementResponse.response_desc}`,ALERT_DANGER)
        }
        this.loadPage = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get payment settlement list, please contact administration`, ALERT_DANGER)
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
        statusPage: "invoice",
        id: this.invCancellationId,
        invoiceNo: this.invoiceNo
      },
    };
    this.bsModalReject = this.bsModalService.show(ModalRejectReasonComponent, Object.assign(ModalLargeConfig, initialState))
  }

  back(){
    this.router.navigateByUrl("/payment/approval-for-invoice-cancellation", { state: { fromDetail: true } });
  }

}
