import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// const BASE_URL = 'http://localhost:8000';
const BASE_URL = "/api"

@Injectable({
  providedIn: 'root'
})
export class InvoiceCancellationService {

  constructor(private http: HttpClient) { }

  getAll(params: any): Observable<any> {
    return this.http.get(`${BASE_URL}/cancelinvoiceapproval/getCancelInvoiceApprList?${params}`);
    // return this.http.get(`${BASE_URL}/getCancelInvoiceApprList?${params}`);
  }

  getDetail(params: any): Observable<any> {
    return this.http.get(`${BASE_URL}/cancelinvoiceapproval/getCancelInvoiceApprDetail?${params}`);
    // return this.http.get(`${BASE_URL}/getCancelInvoiceApprDetail?${params}`);
  }

  saveApproval(params: any): Observable<any> {
    // return this.http.get(`${BASE_URL}/cancelinvoiceapproval/saveApprovalForInvoiceCancellation`,params);
    return this.http.post(`${BASE_URL}/cancelinvoiceapproval/saveApprovalForInvoiceCancellation`,params);
  }

}
