import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { PageChangedEvent, PagesModel, PaginationComponent } from 'ngx-bootstrap/pagination';
import { Paging } from 'src/app/general/models/Paging';
import { PrepaidListSearchParam } from 'src/app/general/models/search-param/PrepaidListSearchParam';
import { Patient } from 'src/app/general/models/Patient';
import { PrepaidList } from 'src/app/general/models/PrepaidList';
import { PrepaidServiceList } from 'src/app/general/models/PrepaidServiceList';
import { PrepaidStatus } from 'src/app/general/models/PrepaidStatus';
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { GetPrepaidListResponse } from 'src/app/general/models/response/GetPrepaidListResponse';
import { GeneralService } from 'src/app/service/general.service';
import { PrepaidService } from 'src/app/service/prepaid.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { DatePipe } from '@angular/common';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-prepaid-list',
  templateUrl: './prepaid-list.component.html',
  styleUrls: ['./prepaid-list.component.scss']
})
export class PrepaidListComponent implements OnInit {

  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent
  getListResponse!: GetListResponse

  defaultPrepaidService: PrepaidServiceList = PrepaidServiceList.default()
  listPrepaidService: PrepaidServiceList[] = [this.defaultPrepaidService]
  selectedPrepaidService: PrepaidServiceList = this.defaultPrepaidService

  defaultPrepaidStatus: PrepaidStatus = PrepaidStatus.deafult()
  listPrepaidStatus: PrepaidStatus[] = [this.defaultPrepaidStatus]
  selectedPrepaidStatus: PrepaidStatus = this.defaultPrepaidStatus

  loadPage: boolean = true
  progress: boolean = false;
  searched: boolean = false

  getPrepaidListResponse: any = {}
  listPrepaid: PrepaidList[] = []

  fromDate: string = ""
  toDate: string = ""
  appointmentDate: string = ""
  bookingId: string = ""
  
  private _selectedPatient: Patient = Patient.defaultWithoutMrNo()
  set selectedPatient(value: Patient) {
    this._selectedPatient = value
    this.getPatientEvent(this._selectedPatient)
  }

  get selectedPatient() {
    return this._selectedPatient
  }

  resetDataPatient: boolean = false

  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page?: number
  current_page = 1

  params: HttpParams = new HttpParams().set("page_no", 1)

  bsModalShowAlert?: BsModalRef
  
  constructor( 
    private router: Router,
    private generalService: GeneralService, 
    private prepaidService: PrepaidService,
    private alertService: ModalAlertService,
    private datePipe: DatePipe
  ) { }

  ngOnInit(): void {
    this.getList()
    this.fromDate = this.getTodaysDate()
    this.toDate = this.getTodaysDate()

    this.params=this.params.set('prepaid_date_start',this.fromDate)
    this.params=this.params.set('prepaid_date_end',this.toDate)
  }

  getTodaysDate() {
    return formatDate(Date.now(), "yyyy-MM-dd", "en-US")
  }

  getList(){
    const params = new HttpParams()
    .set('param_list', 'prepaidServiceList')
    .append('param_list','prepaidStatusList');

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.getListResponse.prepaidServiceList.forEach(s => {
            this.listPrepaidService.push(s)
          })

          this.getListResponse.prepaidStatusList.forEach(s => {
            this.listPrepaidStatus.push(s)
          })

          this.loadPage = false
          this.getSearchParams()
        }else{
          this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
          this.loadPage = false
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
        this.loadPage = false
      });
  }

  getSearchParams() {
    // get search params and search prepaid list
    if (history.state.fromDetail) {
      let searchParams: PrepaidListSearchParam = JSON.parse(window.sessionStorage.getItem(PrepaidListSearchParam.PARAM_KEY)!);

      let status = this.listPrepaidStatus.find(l => l.key == searchParams.status.key);
      let service = this.listPrepaidService.find(l => l.key == searchParams.service.key);

      this.onChangeFromDate(searchParams.from_date)
      this.onChangeToDate(searchParams.to_date)
      this.onChangeAppointmentDate(searchParams.appointment_date)
      this.onChangePrepaidStatus(status)
      this.onChangeBookingId(searchParams.booking_id)
      this.onChangePrepaidService(service)
      if (searchParams.patient.mr_no! > 0) this.selectedPatient = searchParams.patient!

      this.pageChanged({page: searchParams.page_no, itemsPerPage: 0})
      // this.getAllPrepaidList()
      
    } else {
      window.sessionStorage.removeItem(PrepaidListSearchParam.PARAM_KEY)
    }
  }

  saveSearchParams() {
    let searchBody: PrepaidListSearchParam = {
      from_date: this.fromDate,
      to_date: this.toDate,
      appointment_date: this.appointmentDate,
      status: this.selectedPrepaidStatus,
      booking_id: this.bookingId,
      service: this.selectedPrepaidService,
      patient: this.selectedPatient,
      page_no: this.current_page
    }
    window.sessionStorage.setItem(PrepaidListSearchParam.PARAM_KEY, JSON.stringify(searchBody));
  }

  onChangePrepaidService(selected: any){
    this.selectedPrepaidService = selected;
    this.params=this.params.set('service_id',this.selectedPrepaidService.key)
  }

  onChangePrepaidStatus(selected: any){
    this.selectedPrepaidStatus = selected;
    this.params=this.params.set('status',this.selectedPrepaidStatus.key)
  }

  onChangeFromDate(selected: any){
    this.fromDate = selected;
    this.params=this.params.set('prepaid_date_start',this.fromDate)
  }

  onChangeToDate(selected: any){
    this.toDate = selected;
    this.params=this.params.set('prepaid_date_end',this.toDate)
  }

  onChangeAppointmentDate(selected: any){
    this.appointmentDate = selected;
    this.params=this.params.set('appointment_date',this.appointmentDate)
  }

  onChangeBookingId(e: any){
    this.bookingId = e
    this.params=this.params.set('booking_id',e)
  }

  onReset(){
    this.resetDataPatient = true
    this.selectedPrepaidService = {key: "", value: ""}
    this.selectedPrepaidStatus = {key: "", value: ""}
    this.fromDate = ""
    this.toDate = ""
    this.appointmentDate = ""
    this.bookingId = ""
    this.current_page = 1
    this.paging = new Paging(0, 0, 0, 0, 0)
    this.params = new HttpParams().set('page_no',1)
  }

  getPatientEvent(e: any) {
    this.resetDataPatient = false
    this.params = this.params.set('mr_no', this.selectedPatient.mr_no!)
  }

  navigateToHistory(bookId: string, prepaidId: string): void {
    this.router.navigate(['prepaid/prepaid-list-detail',bookId, prepaidId])
  }

  searchPrepaidList() {
    this.paging = new Paging(0, 0, 0, 0, 0)
    this.pageChanged({page: 1, itemsPerPage: 0})
  }

  getAllPrepaidList(event?: PageChangedEvent){
    if (event == undefined) this.params = this.params.set("page_no", 1);
    this.saveSearchParams()

    this.progress = true;

    return this.prepaidService.getAll(this.params)
      .subscribe((data: GetPrepaidListResponse)=>
      {
        this.getPrepaidListResponse = {...data}
        if(this.getPrepaidListResponse.response_code === RESPONSE_SUCCESS){
          this.listPrepaid = this.getPrepaidListResponse.prepaid_list;
          this.paging = PropertyCopier.clone(this.getPrepaidListResponse.paging, this.paging);
          if (event != undefined) this.page = event.page;
          
          this.searched = true
        }else{
          this.alertService.showModalAlert(`Failed to get payment list: ${this.getPrepaidListResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get payment list, please contact administration`, ALERT_DANGER)
        this.progress = false
      });
  }

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.current_page = event.page
    this.getAllPrepaidList(event);
  }

}
