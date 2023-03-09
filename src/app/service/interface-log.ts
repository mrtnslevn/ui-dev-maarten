import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = '/api';

@Injectable({
  providedIn: 'root'
})
export class InterfaceLogService {

  constructor(private http: HttpClient) { }

  getAll(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/interfacelog/getInterfaceLogList?${params}`);
  }

  getDetail(params: any): Observable<any> {
    return this.http.get(`${baseUrl}/interfacelog/getLogDetail?${params}`);
  }

  retryService(params:any): Observable<any> {
    return this.http.post(`${baseUrl}/schedulertoax/retryPostToAx`,params);
  }

}
