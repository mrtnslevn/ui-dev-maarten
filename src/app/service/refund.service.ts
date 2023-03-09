import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = '/api'
const DEPOSIT_API = BASE_URL + "/deposit"
const REFUND_API = DEPOSIT_API + "/refund"
const WRAPPER_HOPE_API = BASE_URL + "/wrapperhope"

const GET_REFUND_APPROVAL_API = REFUND_API + "/getRefundApproval"
const GET_REFUND_INQUIRY_API = REFUND_API + "/inquiry"
const EXPORT_REFUND_APPROVAL_API = REFUND_API + "/exportRefundApproval"
const EXPORT_REFUND_REVISION_API = REFUND_API + "/exportRefundRevision"
const EXPORT_REFUND_INQUIRY_API = REFUND_API + "/exportRefundInquiry"
const PRINT_PRF_API = REFUND_API + "/printPrf"
const PREPAID_LIST_API = BASE_URL + "/prepaidList";

const GET_PREPAID_LIST_API = PREPAID_LIST_API + "/getPrepaidListRequest";
const SAVE_REFUND_DEPOSIT = BASE_URL + "deposit/refund/saveRefundRequest";

@Injectable({
  providedIn: 'root'
})

export class RefundService {
  constructor(private http: HttpClient) { }
  getRefund(params : any) :Observable<any>{
    return this.http.get(BASE_URL);
  }

  getRefundApprovalList(params: HttpParams): Observable<any>{
    return this.http.get(`${GET_REFUND_APPROVAL_API}?${params}`);
  }

  getRefundInquiryList(params: HttpParams): Observable<any>{
    return this.http.get(`${GET_REFUND_INQUIRY_API}?${params}`);
  }

  exportRefundApproval(params: any): Observable<any>{
    return this.http.get(`${EXPORT_REFUND_APPROVAL_API}?${params}`, { responseType: "blob", observe: "response" });
  }

  exportRefundRevision(params: any): Observable<any>{
    return this.http.get(`${EXPORT_REFUND_REVISION_API}?${params}`, { responseType: "blob", observe: "response" });
  }

  exportRefundInquiry(params: any): Observable<any>{
    return this.http.get(`${EXPORT_REFUND_INQUIRY_API}?${params}`, { responseType: "blob", observe: "response" });
  }

  printPRF(req: any): Observable<any> {
    return this.http.post(PRINT_PRF_API, req, { responseType: "blob", observe: "response" });
  }

    getPrepaidListRequest(params: any): Observable<any> {
    return this.http.get(`${GET_PREPAID_LIST_API}?${params}`);
  }

  saveRefundDeposit(params: any): Observable<any> {
    return this.http.post(`${SAVE_REFUND_DEPOSIT}`,params);
  }

}
