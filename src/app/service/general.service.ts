import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// const BASE_URL = 'http://localhost:8000'
const BASE_URL = "/api"
const ADMINISTRATION_API = BASE_URL + "/administration";
const PAYMENT_API = BASE_URL + "/payment";

const GET_LIST_API = ADMINISTRATION_API + "/getList";
const GET_PAYER_LIST_API = ADMINISTRATION_API + "/getPayerList";
const GET_MEDICAL_ORDER_API = PAYMENT_API + "/getMedicalOrderList";
const GET_STORE_LIST_API = ADMINISTRATION_API + "/getStoreList";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<any> {
    return this.http.get(GET_PAYER_LIST_API);
  }

  getPayerList(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_PAYER_LIST_API}?${params}`);
  }

  getPatientList(params: any) : Observable<any> {
    return this.http.get(`${BASE_URL}/wrapperhope/getPatientInfo?${params}`);
    // return this.http.get(`${BASE_URL}/getPatientInfo?${params}`);
  }

  getListWithParam(params: any): Observable<any> {
    return this.http.get(`${GET_LIST_API}?${params}`);
    // return this.http.get(`${BASE_URL}/getList?${params}`);    
  }

  getDoctorList(): Observable<any> {
    return this.http.get(`${BASE_URL}/administration/getDoctorList`);
  }
  
  getStoreList(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_STORE_LIST_API}?${params}`);
  }
    
  getMedicalOrder(params: HttpParams): Observable<any> {
    return this.http.get(`${GET_MEDICAL_ORDER_API}?${params}`);
  }
  
  getWrapperList(): Observable<any> {
    return this.http.get(`${BASE_URL}/wrapper_get_billing`);
  }

  getEdcDetail(params: HttpParams): Observable<any> {
    return this.http.get(`${BASE_URL}/getEdcDetail?${params}`);
  }

  getDashboardNotification(): Observable<any> {
    return this.http.get(`${BASE_URL}/administration/getDashboardNotification`);
  }
}
