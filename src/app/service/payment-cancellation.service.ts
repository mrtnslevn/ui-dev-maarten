import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PaymentCancellation } from '../views/payment/models/PaymentCancellation.model' ;

// const baseUrl = 'http://localhost:8000';
const baseUrl = '/api';


@Injectable({
  providedIn: 'root'
})
export class PaymentCancellationService {

  constructor(private http: HttpClient) { }

  getAll(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/cancelpaymentapproval/getCancelPaymentApprList?${params}`);
    // return this.http.get(`${baseUrl}/getCancelPaymentApprList?${params}`);
  }

  getDetail(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/cancelpaymentapproval/getCancelPaymentApprovalDetail?${params}`);
    // return this.http.get(`${baseUrl}/getCancelPaymentApprovalDetail?${params}`);
  }

  saveApproval(params: any): Observable<any> {
    return this.http.post(`${baseUrl}/cancelpaymentapproval/saveApprovalForPaymentCancellation`,params);
    // return this.http.post(`${baseUrl}/cancelinvoiceapproval/saveApprovalForInvoiceCancellation`,params);
  }
}
