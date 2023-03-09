import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SavePaymentDepositRequest } from '../general/models/request/SavePaymentReq';
import { KuitansiDepositIpdRequest } from '../general/models/request/KuitansiDepositIpdReq';

const BASE_URL = '/api'
const DEPOSIT_API = BASE_URL + "/deposit"
const ADMINISTRATION_API = BASE_URL + "/administration"
const REPORT_API = BASE_URL + "/report"

const WRAPPER_HOPE_API = BASE_URL + "/wrapperhope"
const GET_ADMISSION_LIST_API = WRAPPER_HOPE_API + "/getAdmissionList"
const GET_DEPOSIT_HISTORY_LIST_API =  DEPOSIT_API + "/GetDepositIpdHistory"
const EXPORT_HISTORY_ITEM= BASE_URL + "/deposit/exportDepositIpdHistory"
const GET_DEPOSITOR_INFO = BASE_URL + "/deposit/GetDepositorInfo"
const GET_LIST_API = ADMINISTRATION_API + "/getList"
const GET_PAYMENT_SETTLEMENT_API = DEPOSIT_API + "/GetDepositIpdTransaction"
const KUITANSI_DEPOSIT_IPD_API = REPORT_API + "/kuitansiDepositIpd"
const SAVE_DEPOSIT_PAYMENT_API = DEPOSIT_API + "/savePaymentDeposit"
const GET_DOCUMENT_API = DEPOSIT_API + "/getDocument"

const GET_DEPOSIT_IPD_LIST = BASE_URL + '/deposit/GetDepositIpdList'
const GET_DEPOSIT_IPD_HISTORY = BASE_URL + '/deposit/GetDepositIpdHistory'
const GET_DEPOSIT_IPD_TRANSACTION = BASE_URL + '/deposit/GetDepositIpdTransaction'
const GET_DEPOSIT_IPD_TRANSACTION_DETAIL = BASE_URL + '/deposit/getDepositTransactionDetail'
const GET_DEPOSIT_IPD_DOCUMENT = BASE_URL + '/deposit/GetDocument'
const EXPORT_DEPOSIT_IPD_LIST = BASE_URL + '/deposit/exportDepositIpdList'
const EXPORT_DEPOSIT_IPD_TRANSACTION = BASE_URL + '/deposit/exportDepositIpdTransaction'
const EXPORT_DEPOSIT_IPD_HISTORY = BASE_URL + '/deposit/exportDepositIpdHistory'
const REPORT_DEPOSIT_IPD_RECEIPT = BASE_URL + '/report/kuitansiDepositIpd'
const REPORT_DEPOSIT_IPD_SEND_RECEIPT = BASE_URL + '/report/sendKuitansiDepositIpd'
const GET_DEPOSIT_IPD_TRANSACTION_INFO = BASE_URL + '/deposit/GetDepositorTransactionInfo'

@Injectable({
  providedIn: 'root'
})
export class DepositIpdService {
  constructor(private http: HttpClient) { }
  getDepositIpdList(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_DEPOSIT_IPD_LIST}?${params}`);
  }
  getDepositIpdHistory(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_DEPOSIT_IPD_HISTORY}?${params}`);
  }
  getDepositIpdTransaction(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_DEPOSIT_IPD_TRANSACTION}?${params}`);
  }
  getDepositIpdTransactionDetail(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_DEPOSIT_IPD_TRANSACTION_DETAIL}?${params}`);
  }
  getDepositIpdDocument(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_DEPOSIT_IPD_DOCUMENT}?${params}`, { responseType: "blob", observe: "response" });
  }
  exportDepositIpdList(params: HttpParams): Observable<any> {
    return this.http.get(`${EXPORT_DEPOSIT_IPD_LIST}?${params}`, { responseType: "blob", observe: "response" });
  }
  exportDepositIpdTransaction(params: HttpParams): Observable<any> {
    return this.http.get(`${EXPORT_DEPOSIT_IPD_TRANSACTION}?${params}`, { responseType: "blob", observe: "response" });
  }
  getReportDepositIpdReceipt(params: any): Observable<any> {
    return this.http.post(`${REPORT_DEPOSIT_IPD_RECEIPT}`, params, { responseType: "blob", observe: "response" });
  }
  getReportDepositIpdSendReceipt(params: any): Observable<any> {
    return this.http.post(`${REPORT_DEPOSIT_IPD_SEND_RECEIPT}`, params);
  }
  exportDepositIpdHistory(params: HttpParams): Observable<any> {
    return this.http.get(`${EXPORT_DEPOSIT_IPD_HISTORY}?${params}`, { responseType: "blob", observe: "response" });
  }

  getAdmissionList(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_ADMISSION_LIST_API}?${params}`);
  }

  getDepositHistoryList(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_DEPOSIT_HISTORY_LIST_API}?${params}`);
  }

  exportHistoryList(params: any): Observable<any> {
    return this.http.get(`${EXPORT_HISTORY_ITEM}?${params}`, { responseType: "blob", observe: "response" });
  }

  getDepositorInfo(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_DEPOSITOR_INFO}?${params}`);
  }

  getList(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_LIST_API}?${params}`);
  }

  getSettlement(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_PAYMENT_SETTLEMENT_API}?${params}`);
  }

  kuitansiDepositIpd(req: KuitansiDepositIpdRequest): Observable<any> {
    return this.http.post(KUITANSI_DEPOSIT_IPD_API, { responseType: "blob", observe: "response" })
  }
  saveDepositPayment(req: SavePaymentDepositRequest): Observable<any> {
    return this.http.post(SAVE_DEPOSIT_PAYMENT_API, req);
  }

  getDocument(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_DOCUMENT_API}?${params}`, { responseType: "blob", observe: "response" })
  }

}

