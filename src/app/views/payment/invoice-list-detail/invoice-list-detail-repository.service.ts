import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { SavePaymentRequest } from "src/app/general/models/request/SavePaymentReq";
import { GetCombinedBillResponse } from "src/app/general/models/response/GetCombinedBillResponse";
import { GetEdcDetailResponse } from "src/app/general/models/response/GetEdcDetailResponse";
import { GetInvoiceDetailResponse } from "src/app/general/models/response/GetInvoiceDetailResponse";
import { GetListResponse } from "src/app/general/models/response/GetListResponse";
import { GetOrderedItemResponse } from "src/app/general/models/response/GetOrderedItemResponse";
import { GetPatientListResponse } from "src/app/general/models/response/GetPatientListResponse";
import { GetSalesDiscountResponse } from "src/app/general/models/response/GetSalesDiscountResponse";
import { SavePaymentResponse } from "src/app/general/models/response/SavePaymentResponse";
import { GeneralService } from "src/app/service/general.service";
import { InvoiceInquiryService } from "src/app/service/invoice-inquiry.service";
import { ModalAlertService } from "src/app/service/modal-alert.service";
import { PaymentService } from "src/app/service/payment.service";
import { ALERT_DANGER, RESPONSE_SUCCESS } from "src/app/_configs/app-config";
import { PropertyCopier } from "src/app/_helpers/property-copier";
import { InvoiceListDetailComponent } from "./invoice-list-detail.component";

@Injectable({
  providedIn: 'root'
})
export class InvoiceListDetailRepository {
  component!: InvoiceListDetailComponent
  bsModalShowAlert?: BsModalRef

  private getListResponse!: GetListResponse
  private getInvoiceDetailResponse!: GetInvoiceDetailResponse
  private getSalesDiscountResponse!: GetSalesDiscountResponse
  private getOrderedItemResponse!: GetOrderedItemResponse
  private getPatientListResponse!: GetPatientListResponse
  private savePaymentResponse!: SavePaymentResponse
  private getEdcDetailResponse!: GetEdcDetailResponse
  private getCombinedBillResponse!: GetCombinedBillResponse

  constructor(
    private generalService: GeneralService, 
    private invoiceInquiryService: InvoiceInquiryService,
    private paymentService: PaymentService,
    private alertService: ModalAlertService) { }

  getPaymentMode() {
    const params = new HttpParams()
    .set('param_list', 'paymentModeListForPayment')

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse) => {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.component.paymentModeList = this.getListResponse.paymentModeListForPayment;
        }else{
          this.alertService.showModalAlert(`Failed to get payment mode: ${this.getListResponse.response_desc}`,ALERT_DANGER)
        }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get payment mode, please contact administration`, ALERT_DANGER)
    });
  }

  getCombinedBill(){
    this.component.loadCombinedBillCard = true;
    return this.invoiceInquiryService.getCombinedBill(this.component.params)
      .subscribe((data: GetCombinedBillResponse)=>
      {
        this.getCombinedBillResponse = {...data}
        if(this.getCombinedBillResponse.response_code == RESPONSE_SUCCESS){
          this.component.combinedBill = data.admission_list;
        }else{
          this.alertService.showModalAlert(`Failed to get admission list: ${this.getCombinedBillResponse.response_desc}`,ALERT_DANGER)
        }
        this.component.loadCombinedBillCard = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get admission list, please contact administration`, ALERT_DANGER)
    });
  }

  getPatientInformation(){
    this.component.loadPatientInfoCard = true;
    this.component.loadInvoiceCard = true;

    return this.invoiceInquiryService.getPatientInformation(this.component.params)
      .subscribe((data: GetInvoiceDetailResponse) => {
        this.getInvoiceDetailResponse = {...data}
        if(this.getInvoiceDetailResponse.response_code === RESPONSE_SUCCESS) {
          this.component.patientInfo = PropertyCopier.clone(this.getInvoiceDetailResponse, this.component.patientInfo);
          this.component.invoice = PropertyCopier.clone(this.getInvoiceDetailResponse, this.component.invoice);

          this.getDepositBalance();
          this.getPaymentSettlement();
        }else{
          this.alertService.showModalAlert(`Failed to get patient information: ${this.getInvoiceDetailResponse.response_desc}`,ALERT_DANGER)
        }
        this.component.loadPatientInfoCard = false;
        this.component.loadInvoiceCard = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get patient information, please contact administration`, ALERT_DANGER)
      this.component.loadPatientInfoCard = false;
      this.component.loadInvoiceCard = false;
    });
  }

  getPaymentSettlement(){
    const params: HttpParams = new HttpParams().set("transaction_no", this.component.invoice.invoice_no)
    .set("transaction_type", "Payment").set("page_no", 1);
    this.component.paymentSettlementParams = params;
    this.component.loadPage = false
  }

  getSalesDiscount(){
    this.component.loadInputSalesDiscountCard = true;

    return this.invoiceInquiryService.getSalesDiscount(this.component.params)
      .subscribe((data: GetSalesDiscountResponse) => {
        this.getSalesDiscountResponse = {...data};
        if (this.getSalesDiscountResponse.response_code == RESPONSE_SUCCESS) {
          this.component.salesDiscount = data.sales_discount_list;
        }else{
          this.alertService.showModalAlert(`Failed to get sales discount: ${this.getSalesDiscountResponse.response_desc}`,ALERT_DANGER)
        }
        this.component.loadInputSalesDiscountCard = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get sales discount, please contact administration`, ALERT_DANGER)
      this.component.loadInputSalesDiscountCard = false;
    });
  }

  getOrderedItem(){
    this.component.loadOrderedItemCard = true;

    return this.invoiceInquiryService.getOrderedItem(this.component.params)
      .subscribe((data: GetOrderedItemResponse) => {
        this.getOrderedItemResponse = {...data}
        if (this.getOrderedItemResponse.response_code == RESPONSE_SUCCESS) {
          this.component.orderedItem = data.sales_item_type_list;
          this.component.orderedItem.forEach((i: any) => {
            if(i.is_item_issue === '0'){
              i.sales_item_list.forEach((j: any) => {
                j.checked = false;
              });
            }
          });
        }else{
          this.alertService.showModalAlert(`Failed to get ordered item: ${this.getOrderedItemResponse.response_desc}`,ALERT_DANGER)
        }
        this.component.loadOrderedItemCard = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get ordered item, please contact administration`, ALERT_DANGER)
      this.component.loadOrderedItemCard = false;
    });
  }

  savePayment(body: SavePaymentRequest) {
    this.component.savePaymentProgress = true;
    this.paymentService.savePayment(body).subscribe((data: SavePaymentResponse) => {
      this.savePaymentResponse = {...data};
      if (this.savePaymentResponse.response_code == RESPONSE_SUCCESS) {
        this.component.payment.settle_amount = this.savePaymentResponse.settled_amount;
        this.component.payment.balance = this.savePaymentResponse.balance;
        this.component.settlement_no = this.savePaymentResponse.settlement_no;
        this.component.invoice.payer_balance = this.savePaymentResponse.payer_balance
        this.component.invoice.patient_balance = this.savePaymentResponse.balance;
        this.component.invoice.total_balance = this.savePaymentResponse.total_balance;
        this.component.cancelAddPaymentMode();
        this.getPaymentSettlement();

        this.getDepositBalance();

        this.alertService.showModalAlertSuccess(`Successfully save payment with settlement no: ${this.component.settlement_no}`)
      } else {
        this.alertService.showModalAlert(`Failed to get save payment: ${this.savePaymentResponse.response_desc}`,ALERT_DANGER)
      }
      this.component.readOnlyAmount = true;
      this.component.readOnlyPaymentMode = true;
      this.component.savePaymentProgress = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get save payment, please contact administration`, ALERT_DANGER)
      this.component.readOnlyAmount = true;
      this.component.readOnlyPaymentMode = true;
      this.component.savePaymentProgress = false;
    });
  }

  getDepositBalance() {
    const params = new HttpParams()
      .set("page_no", 1)
      .set("mr_no", this.component.patientInfo.mr_no as number)
      .set("patient_name", this.component.patientInfo.patient_name as string)
      .set("dob", this.component.patientInfo.dob as string)
      .set("patient_id", this.component.patientInfo.patient_id as number);

    this.paymentService.getPatientInfo(params).subscribe((data: GetPatientListResponse) => {
      this.getPatientListResponse = {...data};
      if (this.getPatientListResponse.response_code == RESPONSE_SUCCESS) {
        let patient = this.getPatientListResponse.patient_list[0];
        this.component.patientInfo.deposit_amount = patient.deposit_amount;
      }else{
        this.alertService.showModalAlert(`Failed to get deposit balance: ${this.getPatientListResponse.response_desc}`,ALERT_DANGER)
      }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get deposit balance, please contact administration`, ALERT_DANGER)
    })
  }

  getBankId(edcId: number) {
    const params = new HttpParams().set("edc_id", edcId);
    this.generalService.getEdcDetail(params)
    .subscribe((data: GetEdcDetailResponse) => {
      this.getEdcDetailResponse = {...data};
      if (this.getEdcDetailResponse.response_code == RESPONSE_SUCCESS) {
        this.component.card.bank_id = this.getEdcDetailResponse.bank_id;
      }else{
        this.alertService.showModalAlert(`Failed to get bank id: ${this.getEdcDetailResponse.response_desc}`,ALERT_DANGER)
      }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get bank id, please contact administration`, ALERT_DANGER)
    })
  }
}