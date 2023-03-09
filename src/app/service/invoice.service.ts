import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = '/api';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {

  constructor(private http: HttpClient) { }

  getAll(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/invoicelist/getInvoiceList?${params}`);
  }

  cancelInvoice(params: any): Observable<any> {
    return this.http.post(`${baseUrl}/invoicelist/cancelInvoice`,params);
  }

  exportInvoiceList(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/invoicelist/exportInvoiceList?${params}`, { responseType: "blob", observe: "response" });
  }

}
