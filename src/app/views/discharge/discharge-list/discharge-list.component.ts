import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { formatDate } from '@angular/common';
import { Paging } from 'src/app/general/models/Paging';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { DischargeListSearchParam } from 'src/app/general/models/search-param/DischargeListSearchParam';
import { DischargeService } from 'src/app/service/discharge.service';
import { GetDischargeListResponse } from 'src/app/general/models/response/GetDischargeListResponse';
import { Discharge } from 'src/app/general/models/Discharge';
import { DischargeListFormsService } from './discharge-list-forms.service';
import { Router } from '@angular/router';
import { FinalDischargeLob } from 'src/app/general/models/FinalDischargeLob';


@Component({
  selector: 'app-discharge-list',
  templateUrl: './discharge-list.component.html',
  styleUrls: ['./discharge-list.component.scss']
})
export class DischargeListComponent implements OnInit {
  loadPage: boolean = true;
  progress: boolean = false;
  searched: boolean = false
  progressExport: boolean = false

  getListResponse!: GetListResponse

  orgId: number = 0
  listLob: FinalDischargeLob[] = []
  selectedLob: FinalDischargeLob = FinalDischargeLob.default()
  admissionNo: string = ""
  fromDate: any = ""
  toDate: any = ""
  mrNo: any = ""
  patientName: string = ""

  getDischargeListResponse!: GetDischargeListResponse
  discharge_list: Discharge[] = []

  params: any
  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page?: number
  current_page = 1

  constructor(
    private generalService: GeneralService,
    private dischargeService: DischargeService,
    private alertService: ModalAlertService,
    private token: TokenStorageService,
    public fs: DischargeListFormsService,
    private router: Router,
  ) {
    this.fs.component = this;
    this.fs.createForm();
   }

  ngOnInit(): void {
    const userData = this.token.getUserData();
    this.orgId = userData.hope_organization_id;

    this.getDischargeLob()
    this.fromDate = this.getTodaysDate()
    this.toDate = this.getTodaysDate()
    this.params = new HttpParams()
    .set('page_no',1)
    .set('organization_id',this.orgId)
    .set('discharge_date_from', this.fromDate)
    .set('discharge_date_to', this.toDate)
  }

  getTodaysDate() {
    return formatDate(Date.now(), "yyyy-MM-dd", "en-US")
  }

  getDischargeLob(){
    this.loadPage = true
    const params = new HttpParams()
    .set('param_list', 'finalDischargeLobList')

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.listLob = this.getListResponse.finalDischargeLobList
          this.getSearchParams()
        }else{
          this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
        }
        this.loadPage = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
        this.loadPage = false
      });
  }

  getSearchParams() {
    // get search params and search invoice list
    if (history.state.fromDetail) {
      let params: string = window.sessionStorage.getItem(DischargeListSearchParam.PARAM_KEY)!
      let searchParams: DischargeListSearchParam = JSON.parse(params)

      let lob = this.listLob.find(l => l.key == searchParams.lob.key)

      this.onChangeLob(lob)
      this.onChangeAdmissionNo(searchParams.admission_no)
      this.onChangeFromDate(searchParams.discharge_date_from)
      this.onChangeToDate(searchParams.discharge_date_to)
      this.onChangeMrNo(searchParams.mr_no);
      this.onChangePatientName(searchParams.patient_name);

      this.pageChanged({page: searchParams.page_no, itemsPerPage: 0})

      this.fs.controls['lob'].setValue(lob)
      this.fs.controls['mrNo'].setValue(searchParams.mr_no)
    } else {
      window.sessionStorage.removeItem(DischargeListSearchParam.PARAM_KEY)
    }
  }

  saveSearchParams() {
    let searchBody: DischargeListSearchParam = {
      lob: this.selectedLob,
      admission_no: this.admissionNo,
      discharge_date_from: this.fromDate,
      discharge_date_to: this.toDate,
      page_no: this.current_page,
      mr_no: this.mrNo,
      patient_name: this.patientName,
    }
    
    window.sessionStorage.setItem(DischargeListSearchParam.PARAM_KEY, JSON.stringify(searchBody));
  }

  onChangeLob(e: any){
    this.selectedLob = e;
    this.params = this.params.set('lob_id', this.selectedLob.key)
  }

  onChangeAdmissionNo(e: any){
    this.admissionNo = e
    this.params = this.params.set('admission_no', this.admissionNo)
  }

  onChangeMrNo(e: any){
    this.mrNo = e;
    this.params = this.params.set("mr_no", e)
  }

  onChangePatientName(e: any){
    this.patientName = e;
    this.params = this.params.set("patient_name", e)
  }

  onChangeFromDate(e: any){
    this.fromDate = e;
    this.params = this.params.set("discharge_date_from", e)
  }

  onChangeToDate(e: any){
    this.toDate = e;
    this.params = this.params.set("discharge_date_to", e)
  }

  onValidateSearchList() {
    this.fs.submitted = true;
    if (this.fs.valid) this.searchDischargeList();
  }

  searchDischargeList(event?: PageChangedEvent){
    this.saveSearchParams();
    
    this.progress = true;
    return this.dischargeService.getDischargeList(this.params)
      .subscribe((data: GetDischargeListResponse)=>
      {
        this.getDischargeListResponse = {...data}
        if(this.getDischargeListResponse.response_code === RESPONSE_SUCCESS){
          this.discharge_list = this.getDischargeListResponse.discharge_list;
          // PropertyCopier.copyProperties(this.getDischargeListResponse.paging, this.paging);
          // if (event != undefined) this.page = event.page
        } else {
          this.alertService.showModalAlert(`Failed to get discharge list: ${this.getDischargeListResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false;
        this.searched = true;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get invoice list, please contact administration`, ALERT_DANGER)
        this.progress = false;
        this.searched = true;
      });
  }

  navigateToDetails(admission_no: string, mr_no: number){
    this.router.navigate(['/discharge/discharge-list-detail', admission_no, mr_no])
  }

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.current_page = event.page
    this.searchDischargeList(event);
  }

  exportInvoiceList(){}

  onReset(){
    this.fs.reset()
  }

}
