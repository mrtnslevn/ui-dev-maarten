import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

const BASE_URL = "/api"
const WRAPPER_HOPE_API = BASE_URL + "/wrapperhope";
const PAYMENT_API = BASE_URL + "/payment";

const GET_DISCHARGE_LIST_API = WRAPPER_HOPE_API + "/getDischargeList";
@Injectable({
  providedIn: 'root'
})
export class DischargeService {

  constructor(private http: HttpClient) { }

  getDischargeList(params: any): Observable<any> {
    return this.http.get(`${GET_DISCHARGE_LIST_API}?${params}`);
  }

}
