import { Component, OnInit, ViewChild } from '@angular/core';
import { InvoiceService } from 'src/app/service/invoice.service';
import { ModalService } from '@coreui/angular';
import { Patient } from 'src/app/general/models/Patient';
import { PaymentLob } from 'src/app/general/models/PaymentLob';
import { GeneralService } from 'src/app/service/general.service';
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalCancelComponent } from 'src/app/general/general-modal/modal-cancel/modal-cancel.component';
import { ModalLargeConfig } from 'src/app/_configs/modal-config';
import { HttpParams } from '@angular/common/http';
import { InvoiceList } from 'src/app/general/models/InvoiceList';
import { GetInvoiceListResponse } from 'src/app/general/models/response/GetInvoiceListResponse';
import { Router } from '@angular/router';
import { Paging } from 'src/app/general/models/Paging';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { InvoiceListSearchParam } from 'src/app/general/models/search-param/InvoiceListSearchParam';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { formatDate } from '@angular/common';
import { InvoiceStatus } from 'src/app/general/models/InvoiceStatus';
import { SettlementStatus } from 'src/app/general/models/SettlementStatus';

@Component({
  selector: 'app-invoice-list',
  templateUrl: './invoice-list.component.html',
  styleUrls: ['./invoice-list.component.scss']
})
export class InvoiceListComponent implements OnInit {

  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent
  getInvoiceListResponse: GetInvoiceListResponse | undefined;
  listInvoice: InvoiceList[] = [];

  loadPage: boolean = true;
  progress: boolean = false;
  patient: Patient = Patient.default();

  defaultLob: PaymentLob = PaymentLob.default()
  listLob: PaymentLob[] = [this.defaultLob]
  selectedLob: PaymentLob = this.defaultLob

  invoiceStatusList: InvoiceStatus[] = []
  selectedInvoiceStatus: InvoiceStatus = InvoiceStatus.default()
  settlementStatusList: SettlementStatus[] = []
  selectedSettlementStatus: SettlementStatus = SettlementStatus.default()
  
  private _selectedPatient: Patient = Patient.defaultWithoutMrNo()
  set selectedPatient(value: Patient) {
    this._selectedPatient = value
    this.getPatientEvent(this._selectedPatient)
  }

  get selectedPatient() {
    return this._selectedPatient
  }
  
  getListResponse!: GetListResponse

  bsModalCancel?: BsModalRef
  bsModalShowAlert?: BsModalRef

  admissionNo: string = ""
  invoiceNo: string = ""
  createdUser: string = ""
  invoiceDateFrom: any = ""
  invoiceDateTo: any = ""
  mrNo: any = ""
  patientName: string = ""

  params: any
  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page?: number
  current_page = 1

  exportParams = new HttpParams()
  progressExport: boolean = false
  searched: boolean = false
  resetDataPatient: boolean = false

  constructor(
    private modalService : ModalService,
    private invoiceService: InvoiceService,
    private generalService: GeneralService,
    public bsModalService: BsModalService,
    private router: Router,
    private alertService: ModalAlertService
  ) { }

  ngOnInit(): void {
    this.getPaymentLob()
    
    this.invoiceDateFrom = this.getTodaysDate()
    this.invoiceDateTo = this.getTodaysDate()
    this.params = new HttpParams()
    .set('page_no',1)
    .set('invoice_date_from', this.invoiceDateFrom)
    .set('invoice_date_to', this.invoiceDateTo)
  }

  getTodaysDate() {
    return formatDate(Date.now(), "yyyy-MM-dd", "en-US")
  }

  getPaymentLob(){
    const params = new HttpParams()
    .set('param_list', 'paymentLobList')
    .append('param_list','invoiceStatusList')
    .append('param_list','settlementStatusList')

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.getListResponse.paymentLobList.forEach(l => {
            this.listLob.push(l)
          })
          this.invoiceStatusList = this.getListResponse.invoiceStatusList
          this.settlementStatusList = this.getListResponse.settlementStatusList
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
      let params: string = window.sessionStorage.getItem(InvoiceListSearchParam.PARAM_KEY)!
      let searchParams: InvoiceListSearchParam = JSON.parse(params)

      let lob = this.listLob.find(l => l.key == searchParams.lob.key)

      this.onChangeLob(lob)
      this.onChangeInvoiceNo(searchParams.invoice_no)
      this.onChangeAdmissionNo(searchParams.admission_no)
      this.onChangeCreatedUser(searchParams.created_user)
      this.onChangeInvoiceStatus(searchParams.status)
      this.onChangeSettlementStatus(searchParams.settlement_status)
      this.onChangeInvoiceDateFrom(searchParams.invoice_date_from)
      this.onChangeInvoiceDateTo(searchParams.invoice_date_to)
      this.onChangeMrNo(searchParams.mr_no);
      this.onChangePatientName(searchParams.patient_name);

      this.pageChanged({page: searchParams.page_no, itemsPerPage: 0})
      // this.getAllInvoiceList()
    } else {
      window.sessionStorage.removeItem(InvoiceListSearchParam.PARAM_KEY)
    }
  }

  saveSearchParams() {
    let searchBody: InvoiceListSearchParam = {
      lob: this.selectedLob,
      invoice_no: this.invoiceNo,
      admission_no: this.admissionNo,
      created_user: this.createdUser,
      status: this.selectedInvoiceStatus.value,
      settlement_status: this.selectedSettlementStatus.value,
      invoice_date_from: this.invoiceDateFrom,
      invoice_date_to: this.invoiceDateTo,
      page_no: this.current_page,
      mr_no: this.mrNo,
      patient_name: this.patientName,
    }
    
    window.sessionStorage.setItem(InvoiceListSearchParam.PARAM_KEY, JSON.stringify(searchBody));
  }

  onChangeLob(selected: any){
    this.selectedLob = selected;
    this.params = this.params.set('lob_id', this.selectedLob.key)
  }

  onChangeAdmissionNo(e: any){
    this.admissionNo = e
    this.params = this.params.set('admission_no', this.admissionNo)
  }

  onChangeInvoiceNo(e: any){
    this.invoiceNo = e;
    this.params = this.params.set('invoice_no', this.invoiceNo)
  }

  onChangeCreatedUser(e: any){
    this.createdUser = e;
    this.params = this.params.set('invoice_by', this.createdUser)
  }

  onChangeInvoiceStatus(e: any){
    console.log(e)
    this.selectedInvoiceStatus = e
    this.params = this.params.set('status', this.selectedInvoiceStatus.value)
  }

  onChangeSettlementStatus(e: any){
    console.log(e)
    this.selectedSettlementStatus = e
    this.params = this.params.set('settlement_status', this.selectedSettlementStatus.value)
  }

  onChangeInvoiceDateFrom(selected: any){
    this.invoiceDateFrom = selected;
    this.params = this.params.set('invoice_date_from', this.invoiceDateFrom)
  }

  onChangeInvoiceDateTo(selected: any){
    this.invoiceDateTo = selected;
    this.params = this.params.set('invoice_date_to', this.invoiceDateTo)
  }

  onChangePatientName(name: any) {
    this.patientName = name;
    this.params = this.params.set("patient_name", name)
  }

  onChangeMrNo(mrNo: any){
    this.mrNo = mrNo;
    this.params = this.params.set("mr_no", mrNo)
  }

  getPatientEvent(e: any) {
    this.mrNo = e.mr_no;
    this.resetDataPatient = false
    this.params = this.params.set('mr_no', this.mrNo)
  }

  showModalCancel(invoiceNo: string){
    const initialState: ModalOptions = {
      initialState: {
        statusPage: "invoice",
        statusNumber: invoiceNo
      },
    };
    this.bsModalCancel = this.bsModalService.show(ModalCancelComponent, Object.assign(ModalLargeConfig, initialState))
    
    this.bsModalCancel?.onHide?.subscribe((reason: string) => {
      this.pageChanged({page: this.current_page, itemsPerPage: 0})
    })
  }

  showModalPatient() : void {
    this.modalService.toggle({show: true, id: "modalpatient"});
  }

  searchInvoiceList() {
    this.paging = new Paging(0, 0, 0, 0, 0)
    this.pageChanged({page: 1, itemsPerPage: 0})
  }

  getAllInvoiceList(event?: PageChangedEvent) {
    this.saveSearchParams();
    
    this.progress = true;
    return this.invoiceService.getAll(this.params)
      .subscribe((data: GetInvoiceListResponse)=>
      {
        this.getInvoiceListResponse = {...data}
        if(this.getInvoiceListResponse.response_code === RESPONSE_SUCCESS){
          this.listInvoice = this.getInvoiceListResponse.invoice_list;
          PropertyCopier.copyProperties(this.getInvoiceListResponse.paging, this.paging);
          if (event != undefined) this.page = event.page
        } else {
          this.alertService.showModalAlert(`Failed to get invoice list: ${this.getInvoiceListResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false;
        this.searched = true;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get invoice list, please contact administration`, ALERT_DANGER)
        this.progress = false;
        this.searched = true;
      });
  }

  onReset(){
    this.params = new HttpParams()
    this.selectedLob = this.defaultLob
    this.invoiceNo = ""
    this.admissionNo = ""
    this.createdUser = ""
    this.invoiceDateFrom = ""
    this.invoiceDateTo = ""
    this.mrNo = 0
    this.resetDataPatient = true
    this.params = new HttpParams().set('page_no',1)
  }

  navigateToDetails(invoiceNo: string): void {
    this.router.navigate(['payment/invoice-list-detail',invoiceNo])
  }

  exportInvoiceList(){
    this.progressExport = true
    PropertyCopier.copyProperties(this.params, this.exportParams);
    this.exportParams = this.exportParams.set('export_file_type','EXCEL')

    return this.invoiceService.exportInvoiceList(this.exportParams)
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
        this.alertService.showModalAlert(`Failed to export invoice, please contact administration`,ALERT_DANGER)
        this.progressExport = false;
      });
  }

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.current_page = event.page
    this.getAllInvoiceList(event);
  }

}
