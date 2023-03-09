import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { CreateAppointmentRequest } from "src/app/general/models/request/CreateAppointmentReq";
import { SavePaymentPrepaidRequest } from "src/app/general/models/request/SavePaymentReq";
import { SavePrepaidInvoiceReq } from "src/app/general/models/request/SavePrepaidInvoiceReq";
import { SavePrepaidReq } from "src/app/general/models/request/SavePrepaidReq";
import { CreateAppointmentResponse } from "src/app/general/models/response/CreateAppointmentResponse";
import { GetCovidTestingScheduleResponse } from "src/app/general/models/response/GetCovidTestingScheduleResponse";
import { GetCovidTestingTypeResponse } from "src/app/general/models/response/GetCovidTestingTypeResponse";
import { GetDoctorListResponse } from "src/app/general/models/response/GetDoctorListResponse";
import { GetItemStockandPriceResponse } from "src/app/general/models/response/GetItemStockandPriceResponse";
import { GetListResponse } from "src/app/general/models/response/GetListResponse";
import { GetMedicalOrderResponse } from "src/app/general/models/response/GetMedicalOrderResponse";
import { GetScheduledDoctorResponse } from "src/app/general/models/response/GetScheduledDoctorResponse";
import { GetSpecializationResponse } from "src/app/general/models/response/GetSpecializationResponse";
import { GetTimeSlotResponse } from "src/app/general/models/response/GetTimeSlotResponse";
import { GetUnavailableDateResponse } from "src/app/general/models/response/GetUnavailableDateResponse";
import { SavePaymentResponse } from "src/app/general/models/response/SavePaymentResponse";
import { SavePrepaidResponse } from "src/app/general/models/response/SavePepaidResponse";
import { SavePrepaidInvoiceResponse } from "src/app/general/models/response/SavePrepaidInvoiceResponse";
import { BookingPaymentService } from "src/app/service/booking-payment.service";
import { GeneralService } from "src/app/service/general.service";
import { ALERT_DANGER, OPD, RESPONSE_SUCCESS, ALERT_SUCCESS, ALERT_WARNING } from "src/app/_configs/app-config";
import { BookingPaymentComponent } from "./booking-payment.component";
import { firstValueFrom } from 'rxjs';
import { PrepaidService } from "src/app/service/prepaid.service";
import { formatDate } from "@angular/common";
import { BsModalRef } from "ngx-bootstrap/modal";
import { ModalAlertService } from "src/app/service/modal-alert.service";

@Injectable({
   providedIn: 'root'
 })
 export class BookingPaymentRepository {
   component!: BookingPaymentComponent;
   getSpecialistResponse!: GetSpecializationResponse
   getDoctorListResponse!: GetDoctorListResponse
   getListResponse!: GetListResponse
   getCovidTestingTypeResponse!: GetCovidTestingTypeResponse
   getCovidTestingScheduleResponse!: GetCovidTestingScheduleResponse
   getItemStockandPriceResponse!: GetItemStockandPriceResponse
   getMedicalOrderResponse!: GetMedicalOrderResponse
   getScheduledDoctorResponse!: GetScheduledDoctorResponse
   savePrepaidResponse!: SavePrepaidResponse
   savePrepaidInvoiceResponse!: SavePrepaidInvoiceResponse
   savePaymentResponse!: SavePaymentResponse
   getTimeSlotResponse!: GetTimeSlotResponse
   getUnavailableDateResponse!: GetUnavailableDateResponse
   createAppointmentResponse!: CreateAppointmentResponse

   bsModalShowAlert!: BsModalRef

   constructor(
      private bookingPaymentService: BookingPaymentService, 
      private generalService: GeneralService,
      private prepaidService: PrepaidService,
      private alertService: ModalAlertService) { }

      getList(){
         const params = new HttpParams()
         .set('param_list', 'prepaidServiceList')
         .append('param_list', 'covidTestingTypeList')
         .append('param_list', 'prepaidDiscountTypeList')
         .append('param_list','paymentModeListForPrepaid');
     
         return this.generalService.getListWithParam(params)
           .subscribe((data: GetListResponse)=>
           {
             this.getListResponse = {...data};
             if(this.getListResponse.response_code === RESPONSE_SUCCESS) {
               this.component.listService = this.getListResponse.prepaidServiceList
               this.component.listDiscountType = this.getListResponse.discountTypeList
               this.component.paymentModeList = this.getListResponse.paymentModeListForPrepaid
             } else {
              this.alertService.showModalAlert(`Failed to get data: ${this.getListResponse.response_desc}`,ALERT_DANGER)
             }
           }, err => {
            this.alertService.showModalAlert('An error has occured while get list, please contact administration',ALERT_DANGER)
          });
      }

      getDataMedicalOrder(){
         this.component.patientId==0 ? this.alertService.showModalAlert('Please select patient first',ALERT_WARNING) :
     
         // TODO: Change getMedicalOrder later
         this.component.loadNewBooking = true
         const params = new HttpParams()
         .set('patient_id',this.component.patientId)
         .set('page_no',1)
         return this.generalService.getMedicalOrder(params)
           .subscribe((data: GetMedicalOrderResponse)=>
           {
             this.getMedicalOrderResponse = {...data};
             if(this.getMedicalOrderResponse.response_code === RESPONSE_SUCCESS) {
               this.component.dataMedicalOrder = this.getMedicalOrderResponse.medical_order_list;
               this.component.total_row = this.getMedicalOrderResponse.paging.total_row;
               this.component.itemPerPage = this.getMedicalOrderResponse.paging.rows_per_page;
               this.component.loadNewBooking = false
             } else {
               this.component.loadNewBooking = false
               this.alertService.showModalAlert(`Failed to get Medical Order: ${this.getMedicalOrderResponse.response_desc}`,ALERT_DANGER)
             }
           }, err => {
            this.component.loadNewBooking = false
            this.alertService.showModalAlert('An error has occured while get medical order, please contact administration',ALERT_DANGER)
          });
      }

      getSpecialist(){
         return this.bookingPaymentService.getSpecialist()
         .subscribe((data: GetSpecializationResponse)=>
         {
         this.getSpecialistResponse = {...data};
         if(this.getSpecialistResponse.response_code === RESPONSE_SUCCESS) {
          this.component.listSpecialization = this.getSpecialistResponse.specialist_list;
         }else {
          this.alertService.showModalAlert(`Failed to get specialist: ${this.getSpecialistResponse.response_desc}`,ALERT_DANGER)
         }
         this.component.readDoctorName = false
         }, err => {
          this.alertService.showModalAlert('An error has occured while get specialist, please contact administration',ALERT_DANGER)
          this.component.readDoctorName = false
        });
      }

      getDoctorList(){
        this.component.progressDoctor = true;

         const params = new HttpParams()
         .set('name', '')
         .set('hospital_id', this.component.hospital_id)
         .set('speciality_id',this.component.selectedSpecialization.speciality_id)
         .set('consultation_type_id', this.getConsultationTypeId(this.component.selectedService.key))
   
         return this.bookingPaymentService.getDoctor(params)
         .subscribe((data)=>
         {
         this.getDoctorListResponse = {...data};
         if(this.getDoctorListResponse.response_code === RESPONSE_SUCCESS) {
            this.component.listDoctor = this.getDoctorListResponse.doctor_list;
         } else {
          this.alertService.showModalAlert(`Failed to get doctor list: ${this.getDoctorListResponse.response_desc}`,ALERT_DANGER)
         }
         this.component.readDoctorName = false
         this.component.progressDoctor = false
         }, err => {
          this.alertService.showModalAlert(`An error has occured while get doctor list, please contact administration`,ALERT_DANGER)
          this.component.progressDoctor = false
        });
      }

      getConsultationTypeId(service: string): string {
        let consultationTypeId: string = "";
        switch (service) {
          case "3": // OPD
            consultationTypeId = "1:5:6";
            break;
          case "4": // Tele
            consultationTypeId = "4:6";
            break;
        }
        return consultationTypeId;
      }

      getScheduledDoctor(service: string){
         const params = new HttpParams()
         .set('doctor_id', this.component.selectedDoctor.doctor_id)
         .set('date', formatDate(Date.now(), "yyyy-MM-dd", "en-US"))
         .set('hospital_id', this.component.hospital_id)
         .set('consultation_type_id', this.getConsultationTypeId(service))
       
         return this.bookingPaymentService.getScheduleDoctor(params)
           .subscribe((data: GetScheduledDoctorResponse)=>
           {
             this.getScheduledDoctorResponse = {...data};
             if(this.getScheduledDoctorResponse.response_code === RESPONSE_SUCCESS) {
               this.component.schedule = this.getScheduledDoctorResponse.scheduled_doctor_list
               this.component.schedule = this.component.schedule.filter((x: { doctor_id: any; }) => x.doctor_id == this.component.selectedDoctor.doctor_id)
               this.component.listScheduledDoctor = this.component.schedule[0].schedules
               this.component.listAppointmentTime = this.component.schedule[0].schedules
             } else {
              this.alertService.showModalAlert(`Failed to get doctor schedule: ${this.getScheduledDoctorResponse.response_desc}`,ALERT_DANGER)
             }
             this.component.disabledAppointmentDate = false
           }, err => {
            this.alertService.showModalAlert(`An error has occured while get doctor schedule, please contact administration`, ALERT_DANGER)
            this.component.disabledAppointmentDate = false
          });
      }

      getCovidTestingTypeList(){
         const params = new HttpParams()
         .set('hospital_id',this.component.hospital_id)
   
         return this.bookingPaymentService.getCovidTestingTypeList(params)
         .subscribe((data: GetCovidTestingTypeResponse)=>
         {
            this.getCovidTestingTypeResponse = {...data};
            if(this.getCovidTestingTypeResponse.response_code === RESPONSE_SUCCESS) {
               this.component.listCovidTestingType = this.getCovidTestingTypeResponse.covid_testing_type_list
            }else{
              this.alertService.showModalAlert(`Failed to get covid type: ${this.getCovidTestingTypeResponse.response_desc}`,ALERT_DANGER)
            }
         }, err => {
          this.alertService.showModalAlert('An error has occured while get covid type, please contact administration', ALERT_DANGER)
        });
      }

      getCovidTestingSchedule(){
        this.component.progressTimeSlotCovidTesting = true
         var sales_item = this.component.package.sales_item_id.toString()

         const params = new HttpParams()
         .set('is_drive_thru',`${this.component.isDriveThru}`)
         .set('sales_item_id', sales_item)
         .set('checkup_id', this.component.checkupIdCovidTesting)
         .set('hospital_id', this.component.hospital_id)

         return this.bookingPaymentService.getCovidTestingSchedule(params)
         .subscribe((data: GetCovidTestingScheduleResponse)=>
         {
            this.getCovidTestingScheduleResponse = {...data};
            if(this.getCovidTestingScheduleResponse.response_code === RESPONSE_SUCCESS) {
               this.component.listCovidTestingSchedule = this.getCovidTestingScheduleResponse.schedule_list
            } else {
              this.alertService.showModalAlert(`Failed to get covid schedule: ${this.getCovidTestingScheduleResponse.response_desc}`, ALERT_DANGER)
            }
            this.component.disabledAppointmentTimeCovid = false
            this.component.progressTimeSlotCovidTesting = false
         }, err => {
          this.alertService.showModalAlert('An error has occured while get covid schedule, please contact administration', ALERT_DANGER)
          this.component.disabledAppointmentTimeCovid = false
          this.component.progressTimeSlotCovidTesting = false
        });
      }

      getItemStockandPrice(){
         const params = new HttpParams()
         .set('item_id',this.component.payload.sales_item_id)
   
         return this.bookingPaymentService.getItemStockandPrice(params)
         .subscribe((data: GetItemStockandPriceResponse)=>
         {
            this.getItemStockandPriceResponse = {...data};
            if(this.getItemStockandPriceResponse.response_code === RESPONSE_SUCCESS) {
               this.component.payload.price = this.getItemStockandPriceResponse.price
               this.component.onAddData()
            } else {
              this.alertService.showModalAlert(`Failed to get item stock and price: ${this.getItemStockandPriceResponse.response_desc}`, ALERT_DANGER)
            }
         }, err => {
          this.alertService.showModalAlert('An error has occured while get item and stoce, please contact administration', ALERT_DANGER)
        });
      }

      exportBookingInformationList(){
         this.component.progressExport = true
         this.component.exportParams = {
           export_file_type: 'EXCEL',
           prepaid_detail_list: this.component.bookingInformation
         }
     
         return this.bookingPaymentService.exportBookingInformationList(this.component.exportParams)
           .subscribe((data)=>
           {
            if(data.headers.get("response_code")!="00"){
              this.alertService.showModalAlert(`Failed to export file: ${data.headers.get("response_desc")}`, ALERT_DANGER)  
            }else{
              let blob = data.body as Blob;
              let filename: string = data.headers.get("content-disposition").split(";")[1].split("=")[1].replace(/"/g, '');
              var downloadUrl = window.URL.createObjectURL(blob);
              let a = document.createElement('a');
              a.href = downloadUrl;
              a.download = filename;
              a.click();
            }
            this.component.progressExport = false;
           }, err => {
            this.alertService.showModalAlert(`An error has occured while export booking list, please contact administration`,ALERT_DANGER)
            this.component.progressExport = false;
           });
      }

      saveBookingInformation(){
         for (var i=0; i < this.component.bookingInformation.length; i++){
           this.component.gross = this.component.gross + this.component.bookingInformation[i].price
         }
         this.component.net = this.component.gross
         this.component.balance = this.component.gross
         
         var body: SavePrepaidReq = {
           gross: this.component.gross,
           nationality_id: this.component.nationality_id,
           service_type: this.component.serviceType,
           prepaid_detail_list: this.component.bookingInformation
         }
     
         return this.bookingPaymentService.savePrepaid(body)
         .subscribe((data: SavePrepaidResponse)=>{
             this.savePrepaidResponse = {...data}
             if(this.savePrepaidResponse.response_code === RESPONSE_SUCCESS){
               for(var i=0; i<data.booking_id_list.length; i++){
                 this.component.bookingInformation[i].booking_id = this.savePrepaidResponse.booking_id_list[i]
               }
               const app = this.component.appBookingPayment.nativeElement;
               this.component.appsToDisabled = {
                 appAddBooking: app.querySelector("#addBooking"),
                 appBookingInformation: app.querySelector("#bookingInformation"),
                //  appTableMedicalOrder: app.querySelector("app-table-medical-order"),
               }
               this.component.queryInputs()
               this.component.prepaidId = data.prepaid_id
               this.component.prepaidDate = data.prepaid_date
               this.alertService.showModalAlert('Booking is successfully saved',ALERT_SUCCESS)
               this.component.loadSaveBookingInformation = false
               this.component.loadInvoiceCard = false
               this.component.disabledSaveInvoice = false
               this.component.isUserValid = false
               this.component.showCardInvoice = true
             }else{
              this.alertService.showModalAlert(`${this.savePrepaidResponse.response_desc}`,ALERT_DANGER)
               this.component.loadSaveBookingInformation = false
               this.component.loadInvoiceCard = false
               this.component.disabledSaveInvoice = false
               this.component.isUserValid = false
               this.component.gross = 0
             }
           }, err => {
            this.alertService.showModalAlert(`An error has occured while save booking information, please contact administration`,ALERT_DANGER)
            this.component.loadSaveBookingInformation = false
            this.component.loadInvoiceCard = false
            this.component.disabledSaveInvoice = false
            this.component.isUserValid = false
            this.component.gross = 0
          })
      }

      savePrepaidInvoice(){
         this.component.submittedInvoice = true
         var body: SavePrepaidInvoiceReq = {
           prepaid_id: this.component.prepaidId,
           discount_type_id: parseInt(this.component.selectedDiscountType.key),
           discount_factor: this.component.discountFactor,
           discount_amount: this.component.discountAmount,
           promotion_code: '',
           net: this.component.net,
           rounding: 0,
           balance: this.component.balance
         }
     
         return this.bookingPaymentService.savePrepaidInvoice(body)
           .subscribe((data: SavePrepaidInvoiceResponse)=>{
             this.savePrepaidInvoiceResponse = {...data}
             if(this.savePrepaidInvoiceResponse.response_code === RESPONSE_SUCCESS){
               this.alertService.showModalAlert('Invoice is successfully saved',ALERT_SUCCESS)
               this.component.payment.amount_to_settled = this.component.net
               this.component.payment.balance = this.component.net
               this.component.disabledSaveInvoice = true
               const app = this.component.appBookingPayment.nativeElement;
               this.component.appsToDisabled = Object.assign(this.component.appsToDisabled, {appInvoiceCard: app.querySelector("#invoiceCard")})
               this.component.queryInputs()
               this.component.showCardPayment = true
             }else{
              this.alertService.showModalAlert(`Failed to save invoice: ${this.savePrepaidInvoiceResponse.response_desc}`,ALERT_DANGER)
             }
             this.component.loadSaveInvoiceButton = false
           }, err => {
            this.alertService.showModalAlert(`An error has occured while save invoice, please contact administration`,ALERT_DANGER)
            this.component.loadSaveInvoiceButton = false
          })
      }

      savePayment(body: SavePaymentPrepaidRequest) {
         this.component.progress = true;
         this.bookingPaymentService.savePrepaidPayment(body).subscribe((data: SavePaymentResponse) => {
           this.savePaymentResponse = {...data};
           if (this.savePaymentResponse.response_code == RESPONSE_SUCCESS) {
            this.alertService.showModalAlert('Payment is successfully saved',ALERT_SUCCESS)
             this.component.payment.settle_amount = this.savePaymentResponse.settled_amount
             this.component.payment.balance =  this.savePaymentResponse.balance
             this.component.cancelAddPaymentMode();
             this.component.getPrepaidSettle();
             this.component.loadSaveInvoiceButton = false
             if(this.component.bookingInformation[0].service_id==parseInt(OPD)){
               if(data.balance==0){
                this.component.disabledAdd = true;
                this.getDetailList()
               }
             }else{
              if(data.balance==0){
                this.component.disabledAdd = true;
                // this.getDetailList()
               }
             }
             this.component.showCardPaymentSettlement = true
           } else {
             this.alertService.showModalAlert(`Failed to save payment: ${this.savePaymentResponse.response_desc}`,ALERT_DANGER)
             this.component.loadSaveInvoiceButton = false
           }
           this.component.progress = false;
         }, err => {
          this.alertService.showModalAlert('An error has occured while save payment, please contact administration',ALERT_DANGER)
          this.component.progress = false;
         });
       }
      
       getDetailList(){
        const params = new HttpParams()
        .set('prepaid_id', this.component.prepaidId)
    
        return this.prepaidService.getDetailList(params)
          .subscribe((data)=>
          {
            if(data.response_code === RESPONSE_SUCCESS){
              this.component.bookingInformation[0].booking_id = data.prepaid_detail_list[0].booking_id
            }else{
              this.alertService.showModalAlert(`Failed to get booking id: ${data.response_desc}`,ALERT_DANGER)
            }
          }, err => {
            this.alertService.showModalAlert('An error has occured while get id list, please contact administration',ALERT_DANGER)
          });
      }
          
    getTimeSlot() {
      this.component.progressTimeSlot = true;

      let date = new Date();
      let fromDate = formatDate(date, "yyyy-MM-dd", "en-US")
      date.setMonth(date.getMonth() + 3);
      let toDate = formatDate(date, "yyyy-MM-dd", "en-US");

      let params = new HttpParams();
      params = params.set("doctor_id", this.component.selectedDoctor.doctor_id)
      params = params.set("hospital_id", this.component.hospital_id)
      params = params.set("from_date", fromDate)
      params = params.set("to_date", toDate)
      params = params.set("is_teleconsultation", this.component.isTeleconsultation)

      this.bookingPaymentService.getTimeSlot(params)
      .subscribe((data: GetTimeSlotResponse) => {
        this.getTimeSlotResponse = {...data}
        if (this.getTimeSlotResponse.response_code == RESPONSE_SUCCESS) {
          this.component.timeSlotDateList = this.getTimeSlotResponse.time_slot_list;
          this.component.timeSlotDateList.forEach(t => {
            this.component.enabledAppointmentDates.push(new Date(t.date));
          })
          // this.component.timeSlotList = this.getTimeSlotResponse.time_slot_list[0].time_slot;
          //this.component.timeSlotList = this.component.timeSlotList.filter((x: { schedule_id: any; }) => x.schedule_id == this.component.payload.schedule_id)
        }else{
          this.alertService.showModalAlert(`Failed to get time slot: ${this.getTimeSlotResponse.response_desc}`,ALERT_DANGER)
        }

        this.component.disabledAppointmentTimeSlot = false;
        this.component.progressTimeSlot = false;
      }, err => {
        this.alertService.showModalAlert('An error has occured get time slot, please contact administration',ALERT_DANGER)
        this.component.disabledAppointmentTimeSlot = false
        this.component.disabledAppointmentDate = false;
        this.component.disabledAppointmentTimeSlot = false;
        this.component.progressTimeSlot = false;
      })
    }

    getMcuUnavailableDate() {
      this.component.progressTimeSlot = true;

      let params = new HttpParams();
      params = params.set("sales_item_id", this.component.payload.sales_item_id);
      params = params.set("hospital_hope_id", this.component.hospital_hope_id);

      this.bookingPaymentService.getUnavailableDate(params)
      .subscribe((data: GetUnavailableDateResponse) => {
        this.getUnavailableDateResponse = data;
        if (this.getUnavailableDateResponse.response_code == RESPONSE_SUCCESS) {
          this.component.mcuUnavailableDateList = this.getUnavailableDateResponse.unavailable_date;
          this.component.mcuUnavailableDateList.forEach(d => {
            this.component.disabledMcuDate.push(new Date(d))
          })

          this.component.disabledAppointmentDate = false
        }
        this.component.progressTimeSlot = false
      }, err => {
        this.alertService.showModalAlert('An error has occured mcu get unavailable date, please contact administration',ALERT_DANGER)
        this.component.progressTimeSlot = false
      })
    }

    async checkIfMcuAvailableDate() {
      let params = new HttpParams();
      params = params.set("sales_item_id", this.component.payload.sales_item_id);
      params = params.set("hospital_hope_id", this.component.hospital_hope_id);

        this.getUnavailableDateResponse = await firstValueFrom(this.bookingPaymentService
          .getUnavailableDate(params));
        this.component.loadingAddButton = false
        this.component.disabledAddBooking = false
        const isUnavailable = this.getUnavailableDateResponse.unavailable_date.includes(this.component.selectedAppointmentDate);
        return isUnavailable;
      }

    createAppointment() {
        // TODO: Change later
        let req: CreateAppointmentRequest = {
          appointment_date: "",
          appointment_from_time: "",
          appointment_no: 0,
          appointment_to_time: "",
          birth_date: "",
          contact_id: "",
          doctor_id: "",
          email_address: "",
          hospital_id: "",
          is_waiting_list: false,
          name: "",
          contact_no: "",
          schedule_id: "",
          is_prepaid: false,
          confirmation_code: "",
          order_id: "",
          registration_form_id: ""
        }

        this.bookingPaymentService.createAppointment(req)
        .subscribe((data: CreateAppointmentResponse) => {
          this.createAppointmentResponse = {...data}
          
          if (this.createAppointmentResponse.response_code == RESPONSE_SUCCESS) {

          }
        }, err => {

        })
      }
 }