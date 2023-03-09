import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SendPrepaidRequest } from '../general/models/request/SendPrepaidReq';
import { SendTemporaryPrepaidRequest } from '../general/models/request/SendTemporaryPrepaidReq';
import { CreateAppointmentRequest } from '../general/models/request/CreateAppointmentReq';

const baseUrl = '/api';

@Injectable({
  providedIn: 'root'
})

export class BookingPaymentService{
   constructor(private http: HttpClient) { }

   getMcuPackage(params: any): Observable<any> {
      return this.http.get(`${baseUrl}/wrappermysiloam/mcu/listpackage?${params}`);
   }

   getCovidPackage(params: any): Observable<any> {
      return this.http.get(`${baseUrl}/wrappermysiloam/covid/listpackage?${params}`);
   }

   getCovidTestingTypeList(params: any): Observable<any> {
      return this.http.get(`${baseUrl}/wrappermysiloam/covid/listservice?${params}`);
   }

   getCovidTestingSchedule(params: any): Observable<any> {
      return this.http.get(`${baseUrl}/wrappermysiloam/covid/getSchedule?${params}`);
   }

   getDoctor(params: any): Observable<any> {
      return this.http.get(`${baseUrl}/wrappermysiloam/getDoctor?${params}`);
   }

   getScheduleDoctor(params: any): Observable<any> {
      return this.http.get(`${baseUrl}/wrappermysiloam/getScheduledDoctor?${params}`);
   }

   getSpecialist(): Observable<any> {
      return this.http.get(`${baseUrl}/wrappermysiloam/getSpecialist`);
   }

   getItemStockandPrice(params: any): Observable<any> {
      return this.http.get(`${baseUrl}/wrapperhope/getItemStockAndPrice?${params}`);
   }

   savePrepaid(body: any): Observable<any> {
      return this.http.post(`${baseUrl}/prepaid/savePrepaid`,body);
   }

   savePrepaidInvoice(params: any): Observable<any> {
      return this.http.post(`${baseUrl}/prepaid/savePrepaidInvoice`,params);
   }

   savePrepaidPayment(params: any): Observable<any> {
      return this.http.post(`${baseUrl}/prepaid/savePrepaidPayment`,params);
   }

   exportBookingInformationList(params: any): Observable<any>{
      return this.http.post(`${baseUrl}/report/exportBookingList`,params, { responseType: "blob", observe: "response" });   
   }

   printPrepaid(params: any): Observable<any> {
      return this.http.post(`${baseUrl}/report/prepaid`,params, { responseType: "blob", observe: "response" });
   }

   printTemporaryPrepaid(params: any): Observable<any>{
      return this.http.post(`${baseUrl}/report/temporaryPrepaid`,params, { responseType: "blob", observe: "response" });   
   }

   sendPrepaid(req: SendPrepaidRequest): Observable<any> {
      return this.http.post(`${baseUrl}/report/sendPrepaid`, req);
    }
  
    sendTemporaryPrepaid(req: SendTemporaryPrepaidRequest): Observable<any> {
      return this.http.post(`${baseUrl}/report/sendTemporaryPrepaid`, req);
    }
   
   getTimeSlot(params: HttpParams): Observable<any> {
      return this.http.get(`${baseUrl}/wrappermysiloam/getTimeSlot?${params}`);
   }

   getUnavailableDate(params: HttpParams): Observable<any> {
      return this.http.get(`${baseUrl}/wrappermysiloam/mcu/getUnavailableDate?${params}`);
   }

   createAppointment(req: CreateAppointmentRequest): Observable<any> {
      return this.http.post(`${baseUrl}/wrappermysiloam/createAppointment`, req);
   }
}