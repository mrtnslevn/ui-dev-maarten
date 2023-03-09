import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = '/api';

@Injectable({
  providedIn: 'root'
})
export class InvoiceInquiryService {

  constructor(private http: HttpClient) { }

  getCombinedBill(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/invoiceinquiry/getCombinedBill?${params}`);
  }

  getPatientInformation(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/invoiceinquiry/getInvoiceDetail?${params}`);
  }

  getOrderedItem(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/invoiceinquiry/getOrderedItem?${params}`);
  }

  getSalesDiscount(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/invoiceinquiry/getSalesDiscount?${params}`);
  }

  getCustomAddDiscount(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/invoiceinquiry/getcustomAddDiscount?${params}`);
  }

  getPaymentSettlement(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/invoiceinquiry/getPaymentSettlementList?${params}`);
  }

  getPaymentDetail(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/invoiceinquiry/getPaymentDetail?${params}`);
  }

}
