import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { ModalCancelComponent } from 'src/app/general/general-modal/modal-cancel/modal-cancel.component';
import { Paging } from 'src/app/general/models/Paging';
import { PaymentListSearchParam } from 'src/app/general/models/search-param/PaymentListSearchParam';
import { Patient } from 'src/app/general/models/Patient';
import { PaymentLob } from 'src/app/general/models/PaymentLob';
import { PaymentStatus } from 'src/app/general/models/PaymentStatus';
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { GetPaymentListResponse } from 'src/app/general/models/response/GetPaymentListResponse';
import { GeneralService } from 'src/app/service/general.service';
import { PaymentListService } from 'src/app/service/payment-list.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { ModalLargeConfig } from 'src/app/_configs/modal-config';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit {
  @ViewChild (PaginationComponent) paginationComp!: PaginationComponent
  bsModalRef?: BsModalRef;
  bsModalShowAlert?: BsModalRef;

  settlementNo: string = ""

  defaultLob: PaymentLob = PaymentLob.default()
  listLob: PaymentLob[] = [this.defaultLob]
  selectedLob: PaymentLob = this.defaultLob

  defaultPaymentStatus: PaymentStatus = PaymentStatus.default()
  listPaymentStatus: PaymentStatus[] = [this.defaultPaymentStatus]
  selectedStatus: PaymentStatus = this.defaultPaymentStatus
  getListResponse!: GetListResponse

  settlementDateFrom: any = ""
  settlementDateTo: any = ""
  invoiceNo: string = ""
  mrNo: any = ""
  createdUser: string = ""
  patientName: string = ""

  getPaymentListResponse: any = {}
  loadPage: boolean = true;
  progress: boolean = false;
  paymentList: any = []

  params: any
  exportParams = new HttpParams()
  progressExport: boolean = false

  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page?: number
  current_page = 1

  private _selectedPatient: Patient = Patient.defaultWithoutMrNo()
  set selectedPatient(value: Patient) {
    this._selectedPatient = value
    this.getPatientEvent(this._selectedPatient)
  }

  get selectedPatient() {
    return this._selectedPatient
  }

  searched: boolean = false
  resetDataPatient: boolean = false

  constructor(private paymentListService: PaymentListService, private router: Router,
    public bsModalService : BsModalService, private generalService: GeneralService,
    private alertService: ModalAlertService) { }

  ngOnInit(): void {
    this.getList()

    this.settlementDateFrom = this.getTodaysDate()
    this.settlementDateTo = this.getTodaysDate()

    this.params = new HttpParams()
    .set('page_no',1)
    .set('settlement_date_from', this.settlementDateFrom)
    .set('settlement_date_to', this.settlementDateTo)
  }

  getTodaysDate() {
    return formatDate(Date.now(), "yyyy-MM-dd", "en-US")
  }

  getList(){
    const params = new HttpParams()
    .set('param_list', 'paymentLobList')
    .append('param_list', 'paymentStatusList');

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.getListResponse.paymentLobList.forEach(l => {
            this.listLob.push(l);
          })
          
          this.getListResponse.paymentStatusList.forEach(p => {
            this.listPaymentStatus.push(p)
          })

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
    // get search params and search payment list
    if (history.state.fromDetail) {
      let params: string = window.sessionStorage.getItem(PaymentListSearchParam.PARAM_KEY)!
      let searchParams: PaymentListSearchParam = JSON.parse(params)

      let lob = this.listLob.find(l => l.key == searchParams.lob?.key);
      let status = this.listPaymentStatus.find(l => l.key == searchParams.settlement_status?.key);

      this.onChangeLob(lob)
      this.onChangeStatus(status);
      this.onChangeSettlementDateFrom(searchParams.settlement_date_from)
      this.onChangeSettlementDateTo(searchParams.settlement_date_to)
      this.onChangeInvoiceNo(searchParams.invoice_no)
      this.onChangeSettlementNo(searchParams.settlement_no!)
      this.onChangeCreatedUser(searchParams.created_user)
      this.onChangeMrNo(searchParams.mr_no);
      this.onChangePatientName(searchParams.patient_name);
      
      this.pageChanged({page: searchParams.page_no, itemsPerPage: 0})
      // this.getAll()
    } else {
      window.sessionStorage.removeItem(PaymentListSearchParam.PARAM_KEY)
    }
  }

  saveSearchParams() {
    let searchBody: PaymentListSearchParam = {
      lob: this.selectedLob,
      settlement_status: this.selectedStatus,
      settlement_date_from: this.settlementDateFrom,
      settlement_date_to: this.settlementDateTo,
      invoice_no: this.invoiceNo,
      settlement_no: this.settlementNo,
      created_user: this.createdUser,
      page_no: this.current_page,
      mr_no: this.mrNo,
      patient_name: this.patientName,
    }
    window.sessionStorage.setItem(PaymentListSearchParam.PARAM_KEY, JSON.stringify(searchBody));
  }

  onChangeLob(selected: any){
    this.selectedLob = selected;
    this.params = this.params.set('selected_lob',this.selectedLob.key)
  }

  onChangeStatus(selected: any){
    this.selectedStatus = selected;
    let param: string = this.selectedStatus.key == "" ? "" : this.selectedStatus.value
    this.params = this.params.set('settlement_status',param)
  }

  onChangeSettlementNo(settlementNo: string){
    this.settlementNo = settlementNo
    this.params = this.params.set('settlement_no',this.settlementNo)
  }

  onChangeSettlementDateFrom(selected: any){
    this.settlementDateFrom = selected;
    this.params = this.params.set('settlement_date_from', this.settlementDateFrom)
  }

  onChangeSettlementDateTo(selected: any){
    this.settlementDateTo = selected;
    this.params = this.params.set('settlement_date_to', this.settlementDateTo)
  }

  onChangeInvoiceNo(e: any){
    this.invoiceNo = e;
    this.params = this.params.set('invoice_no',this.invoiceNo)
  }

  onChangePatientName(name: string) {
    this.patientName = name;
    this.params = this.params.set("patient_name", name)
  }

  onChangeMrNo(mrNo: number){
    this.mrNo = mrNo;
    this.params = this.params.set("mr_no", mrNo)
  }

  getPatientEvent(e: any) {
    this.mrNo = e.mr_no;
    this.resetDataPatient = false
    this.params = this.params.set('mr_no',this.mrNo)
  }

  onChangeCreatedUser(e: any){
    this.createdUser = e;
  }

  onReset(){
    this.createdUser = ""
    this.invoiceNo = ""
    this.selectedLob = {key:'', value:''}
    this.selectedStatus = {key:'', value:''}
    this.settlementDateFrom = ""
    this.settlementDateTo = ""
    this.settlementNo = ""
    this.resetDataPatient = true
    this.params = new HttpParams().set('page_no',1)
  }

  searchPaymentList() {
    this.paging = new Paging(0, 0, 0, 0, 0)
    this.pageChanged({page: 1, itemsPerPage: 0})
  }

  getAll(event?: PageChangedEvent){
    this.saveSearchParams()

    this.progress = true;

    return this.paymentListService.getAll(this.params)
      .subscribe((data: GetPaymentListResponse)=>
      {
        this.getPaymentListResponse = {...data}
        if(this.getPaymentListResponse.response_code === RESPONSE_SUCCESS){
          this.paymentList = this.getPaymentListResponse.payment_list;
          PropertyCopier.copyProperties(this.getPaymentListResponse.paging, this.paging);

          if (event != undefined) this.page = event.page;
          this.searched = true
        }else{
          this.alertService.showModalAlert(`Failed to get service: ${this.getPaymentListResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get service, please contact administration`, ALERT_DANGER)
        this.progress = false
      });
  }

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.current_page = event.page
    this.getAll(event);
  }

  navigateToDetails(settlementNo: string, invoiceNo: string): void {
    this.router.navigate(['payment/payment-list-detail',settlementNo,invoiceNo])
  }

  showModalCancel(settlementNo: string) : void {
    const initialState: ModalOptions = {
      initialState: {
        statusPage: "payment",
        statusNumber: settlementNo
      },
    };

    
    this.bsModalRef = this.bsModalService.show(ModalCancelComponent, Object.assign(ModalLargeConfig, initialState));
    this.bsModalRef?.onHide?.subscribe((reason: string) => {
      this.pageChanged({page: this.current_page, itemsPerPage: 0})
    })
  }

  exportPaymentList(){
    this.progressExport = true
    PropertyCopier.copyProperties(this.params, this.exportParams);
    this.exportParams = this.exportParams.set('export_file_type','EXCEL')

    return this.paymentListService.exportPaymentList(this.exportParams)
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
        this.progressExport = false;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while export list, please contact administration`, ALERT_DANGER)
        this.progressExport = false;
      });
  }

}
