import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SaveSalesDiscount } from '../general/models/request/SaveSalesDiscountReq';
import { BASE_URL } from '../_configs/app-config';
import { GetBillingRequest } from '../general/models/request/GetBillingReq';
import { MidtransPaymentReq } from '../general/models/request/MidtransPaymentReq';
import { SavePaymentRequest } from '../general/models/request/SavePaymentReq';
import { SaveInvoiceRequest } from '../general/models/request/SaveInvoiceReq';
import { PrintInvoiceRequest } from '../general/models/request/PrintInvoiceReq';
import { PrintTemporaryInvoiceRequest } from '../general/models/request/PrintTemporaryInvoiceReq';
import { SendInvoiceRequest } from '../general/models/request/SendInvoiceReq';
import { SendTemporaryInvoiceRequest } from '../general/models/request/SendTemporaryInvoiceReq';
import { AddSalesArItemIssueRequest } from '../general/models/request/AddSalesArItemIssueReq';
import { AddSalesArItemTransactionRequest } from '../general/models/request/AddSalesArItemTransactionReq';
import { AddSalesArItemPackageRequest } from '../general/models/request/AddSalesArItemPackageReq';
import { ChangePayerRequest } from '../general/models/request/ChangePayerReq';
import { ReturnArItemIssueRequest } from '../general/models/request/ReturnArItemIssueRequest';
import { RemoveArItemTransactionRequest } from '../general/models/request/RemoveArItemTransactionReq';
import { CancelArItemPackageRequest } from '../general/models/request/CancelArItemPackageReq';

const baseUrl = BASE_URL;
const ADMINISTRATION_API = BASE_URL + "/administration"
const WRAPPER_HOPE_API = BASE_URL + "/wrapperhope"
const PAYMENT_API = BASE_URL + "/payment"
const REPORT_API = BASE_URL + "/report"
const DIGITAL_PAYMENT_API = BASE_URL + "/digitalpayment"
const INVOICE_INQUIRY_API = BASE_URL + "/invoiceinquiry"

const GET_LIST_API = ADMINISTRATION_API + "/getList"
const GET_ADMISSION_LIST_API = WRAPPER_HOPE_API + "/getAdmissionList"
const GET_PATIENT_INFO_API = WRAPPER_HOPE_API + "/getPatientInfo"
const GET_BILLING_API = PAYMENT_API + "/getBilling"
const GET_ADMISSION_DETAIL_API = WRAPPER_HOPE_API + "/getAdmissionDetail"
const GET_COVERAGE_REQUEST_APPROVAL = WRAPPER_HOPE_API + "/getCoverageRequestApproval"
const GET_MEDICAL_ORDER_API = PAYMENT_API + "/getMedicalOrderList"
const EXPORT_COMBINED_BILL_API = REPORT_API + "/exportCombinedBill"
const EXPORT_ORDERED_ITEM_API = REPORT_API + "/exportOrderedItem"
const GET_SALES_ITEM_API = PAYMENT_API + "/getSalesItemList"
const GET_SALES_DISCOUNT_API = PAYMENT_API + "/getSalesDiscountByAdmissionNo"
const SAVE_SALES_DISCOUNT_API = PAYMENT_API + "/saveSalesDiscount"
const SAVE_INVOICE_API = PAYMENT_API + "/saveInvoice"
const PRINT_INVOICE_API = REPORT_API + "/invoice"
const PRINT_TEMPORARY_INVOICE_API = REPORT_API + "/temporaryInvoice"
const SEND_INVOICE_API = REPORT_API + "/sendInvoice"
const SEND_TEMPORARY_INVOICE_API = REPORT_API + "/sendTemporaryInvoice"
const MIDTRANS_PAYMENT_API = DIGITAL_PAYMENT_API + "/midtransPayment"
const MIDTRANS_INQUIRY_API = DIGITAL_PAYMENT_API + "/midtransInqStatus"
const SAVE_PAYMENT_API = PAYMENT_API + "/savePayment"
const GET_PAYMENT_SETTLEMENT_API = INVOICE_INQUIRY_API + "/getPaymentSettlementList"
const GET_ITEM_STOCK_AND_PRICE_API = WRAPPER_HOPE_API + "/getItemStockAndPrice"
const GET_PRICE_ITEM_PACKAGE_API = WRAPPER_HOPE_API + "/getPriceItemPackage"
const GET_SERVICE_PRICE_API = WRAPPER_HOPE_API + "/getServicePrice"
const ADD_SALES_AR_ITEM_ISSUE_API = WRAPPER_HOPE_API + "/insertItemIssue"
const ADD_SALES_AR_ITEM_TRANSACTION_API = PAYMENT_API + "/insertTransaction"
const ADD_SALES_AR_ITEM_PACKAGE_API = WRAPPER_HOPE_API + "/insertPackageTransaction"
const CHANGE_PAYER_API = WRAPPER_HOPE_API + "/changePayer"
const RETURN_AR_ITEM_ISSUE_API = WRAPPER_HOPE_API + "/returnArItemIssue"
const RETURN_AR_ITEM_TRANSACTION_API = PAYMENT_API + "/cancelTransactionService"
const CANCEL_AR_ITEM_PACKAGE_API = WRAPPER_HOPE_API + "/cancelTransactionPackage"
const GET_INVOICE_API = WRAPPER_HOPE_API + "/getInvoice"

@Injectable({
  providedIn: 'root'
})
export class PaymentService {

  constructor(private http: HttpClient) { }

  getList(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_LIST_API}?${params}`);
  }

  getAdmissionList(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_ADMISSION_LIST_API}?${params}`);
  }

  getPatientInfo(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_PATIENT_INFO_API}?${params}`);
  }

  getBilling(req: GetBillingRequest): Observable<any> {
    return this.http.post(GET_BILLING_API, req);
  }

  getSalesItem(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_SALES_ITEM_API}?${params}`);
  }

  getAdmissionDetail(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_ADMISSION_DETAIL_API}?${params}`);
  }

  getCoverageRequestApproval(params: HttpParams): Observable<any>{
    return this.http.get(`${GET_COVERAGE_REQUEST_APPROVAL}?${params}`);
  }

  getPaymentSettle(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_PAYMENT_SETTLEMENT_API}?${params}`);
  }

  getAddRemoveSalesItem(): Observable<any> {
    return this.http.get(`${baseUrl}/add_remove_sales_item`);
  }

  doSaveSalesDiscount(req: SaveSalesDiscount): Observable<any> {
    return this.http.post(SAVE_SALES_DISCOUNT_API, req)
  }

  saveInvoice(req: SaveInvoiceRequest): Observable<any> {
    return this.http.post(SAVE_INVOICE_API, req);
  }

  getSalesDiscountByAdmissionNo(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_SALES_DISCOUNT_API}?${params}`);
  }

  getMedicalOrder(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_MEDICAL_ORDER_API}?${params}`);
  }

  exportCombinedBill(req: any): Observable<any> { 
    return this.http.post(EXPORT_COMBINED_BILL_API, req, { responseType: "blob", observe: "response" });
  }

  exportOrderedItem(req: any): Observable<any> {
    return this.http.post(EXPORT_ORDERED_ITEM_API, req, { responseType: "blob", observe: "response" })
  }

  printInvoice(req: PrintInvoiceRequest): Observable<any> {
    return this.http.post(PRINT_INVOICE_API, req, { responseType: "blob", observe: "response" });
  }

  printTemporaryInvoice(req: PrintTemporaryInvoiceRequest): Observable<any> {
    return this.http.post(PRINT_TEMPORARY_INVOICE_API, req, { responseType: "blob", observe: "response" });
  }

  sendInvoice(req: SendInvoiceRequest): Observable<any> {
    return this.http.post(SEND_INVOICE_API, req);
  }

  sendTemporaryInvoice(req: SendTemporaryInvoiceRequest): Observable<any> {
    return this.http.post(SEND_TEMPORARY_INVOICE_API, req);
  }

  midtransPayment(req: MidtransPaymentReq): Observable<any> {
    return this.http.post(MIDTRANS_PAYMENT_API, req)
  }

  midtransInquiryStatus(params: HttpParams): Observable<any> {
    return this.http.get(`${MIDTRANS_INQUIRY_API}?${params}`);
  }

  savePayment(req: SavePaymentRequest): Observable<any> {
    return this.http.post(SAVE_PAYMENT_API, req);
  }

  getItemStockAndPrice(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_ITEM_STOCK_AND_PRICE_API}?${params}`)
  }

  getServicePrice(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_SERVICE_PRICE_API}?${params}`);
  }

  getPriceItemPackage(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_PRICE_ITEM_PACKAGE_API}?${params}`)
  }

  addSalesArItemIssue(req: AddSalesArItemIssueRequest): Observable<any> {
    return this.http.post(`${ADD_SALES_AR_ITEM_ISSUE_API}`, req)
  }

  addSalesArItemTransaction(req: AddSalesArItemTransactionRequest): Observable<any> {
    return this.http.post(`${ADD_SALES_AR_ITEM_TRANSACTION_API}`, req)
  }

  addSalesArItemPackage(req: AddSalesArItemPackageRequest): Observable<any> {
    return this.http.post(`${ADD_SALES_AR_ITEM_PACKAGE_API}`, req)
  }

  changePayer(req: ChangePayerRequest): Observable<any> {
    return this.http.post(`${CHANGE_PAYER_API}`, req)
  }

  returnArItemIssue(req: ReturnArItemIssueRequest): Observable<any> {
    return this.http.post(`${RETURN_AR_ITEM_ISSUE_API}`, req)
  }

  removeArItemTransaction(req: RemoveArItemTransactionRequest): Observable<any> {
    return this.http.post(`${RETURN_AR_ITEM_TRANSACTION_API}`, req)
  }

  cancelArItemPackage(req: CancelArItemPackageRequest): Observable<any> {
    return this.http.post(`${CANCEL_AR_ITEM_PACKAGE_API}`, req)
  }

  getInvoice(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_INVOICE_API}?${params}`)
  }
}
