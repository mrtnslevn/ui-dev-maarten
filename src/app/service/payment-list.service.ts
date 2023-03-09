import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = '/api';

@Injectable({
  providedIn: 'root'
})
export class PaymentListService {

  constructor(private http: HttpClient) { }

  getAll(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/paymentlist/getPaymentList?${params}`);
  }

  cancelPayment(params: any): Observable<any> {
    return this.http.post(`${baseUrl}/paymentlist/cancelPayment`,params);
  }

  exportPaymentList(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/paymentlist/exportPaymentList?${params}`, { responseType: "blob", observe: "response" });
  }

}
