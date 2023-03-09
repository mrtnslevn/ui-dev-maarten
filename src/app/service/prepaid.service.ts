import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BASE_URL } from '../_configs/app-config';

const baseUrl = '/api';
const PREPAID_API = BASE_URL + "/prepaid";

const GET_PREPAID_LIST_BY_MR_NO_API = PREPAID_API + "/getPrepaidListByMrNo";

@Injectable({
  providedIn: 'root'
})
export class PrepaidService {

  constructor(private http: HttpClient) { }

  getAll(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/prepaidlist/getPrepaidList?${params}`);
  }

  getBookingDetail(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/prepaidlist/getBookingDetail?${params}`);
  }

  getHistory(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/prepaidlist/getPrepaidHistory?${params}`);
  }

  getDetailList(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/prepaidlist/getPrepaidTransaction?${params}`);
  }

  getPaymentSettlement(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/invoiceinquiry/getPaymentSettlementList?${params}`);
  }

  getPrepaidListByMrNo(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_PREPAID_LIST_BY_MR_NO_API}?${params}`);
  }
}
