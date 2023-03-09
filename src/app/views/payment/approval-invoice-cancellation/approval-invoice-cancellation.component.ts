import { InvoiceCancellationService } from './../../../service/invoice-cancellation.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/service/general.service';
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { PaymentLob } from 'src/app/general/models/PaymentLob';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { HttpParams } from '@angular/common/http';
import { CancelApprovalInvoice } from 'src/app/general/models/CancelApprovalInvoice';
import { GetInvoiceCancellationResponse } from 'src/app/general/models/response/GetInvoiceCancellationResponse';
import { Patient } from 'src/app/general/models/Patient';
import { Paging } from 'src/app/general/models/Paging';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { ApprovalInvoiceCancellationSearchParam } from 'src/app/general/models/search-param/ApprovalInvoiceCancellationSearchParm';
import { BsModalRef} from 'ngx-bootstrap/modal';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-approval-invoice-cancellation',
  templateUrl: './approval-invoice-cancellation.component.html',
  styleUrls: ['./approval-invoice-cancellation.component.scss']
})
export class ApprovalInvoiceCancellationComponent implements OnInit {
  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent
  listInvoice: CancelApprovalInvoice[] = [];
  progress: boolean = false;
  loadPage: boolean = true;

  getListResponse!: GetListResponse

  defaultLob: PaymentLob = PaymentLob.default()
  listLob: PaymentLob[] = [this.defaultLob]
  selectedLob: PaymentLob = this.defaultLob

  getInvoiceResponse: any = {}

  private _selectedPatient: Patient = Patient.defaultWithoutMrNo()
  set selectedPatient(value: Patient) {
    this._selectedPatient = value
    this.getPatientEvent(this._selectedPatient)
  }

  get selectedPatient() {
    return this._selectedPatient
  }

  lob_id: number = 0
  invoice_no: string = ""
  invoice_by: string = ""
  invoice_date_from: string = ""
  invoice_date_to: string = ""
  cancel_date_from: string = ""
  cancel_date_to: string = ""
  mr_no: any = ""
  page_no: number = 0
  patientName: string = ""

  params: any
  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page?: number
  current_page = 1
  searched: boolean = false
  
  resetDataPatient: boolean = false
  bsModalShowAlert?: BsModalRef

  constructor(private router: Router, private invoiceCancellationService: InvoiceCancellationService,
    private generalService: GeneralService, private alertService: ModalAlertService) { }

  ngOnInit(): void {
    
    this.invoice_date_from = this.getTodaysDate()
    this.invoice_date_to = this.getTodaysDate()
    this.cancel_date_from = this.getTodaysDate()
    this.cancel_date_to = this.getTodaysDate()
    
    this.params = new HttpParams()
    .set('page_no',1)
    .set('invoice_date_from', this.invoice_date_from)
    .set('invoice_date_to', this.invoice_date_to)
    .set('cancel_date_from',this.cancel_date_from)
    .set('cancel_date_to',this.cancel_date_to)
    
    this.getList()
  }

  getTodaysDate() {
    return formatDate(Date.now(), "yyyy-MM-dd", "en-US")
  }

  getList(){
    const params = new HttpParams()
    .set('param_list', 'paymentLobList');

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.getListResponse.paymentLobList.forEach(l => {
            this.listLob.push(l)
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
    // get search params and search approval invoice cancellation list
    if (history.state.fromDetail) {
      let params: string = window.sessionStorage.getItem(ApprovalInvoiceCancellationSearchParam.PARAM_KEY)!
      let searchParams: ApprovalInvoiceCancellationSearchParam = JSON.parse(params)

      let lob = this.listLob.find(l => l.key == searchParams.lob.key);
      
      this.onChangeLob(lob)
      this.onChangeInvoiceNo(searchParams.invoice_no)
      this.onChangeInvoiceDateFrom(searchParams.invoice_date_from)
      this.onChangeInvoiceDateTo(searchParams.invoice_date_to)
      this.onChangeCancelDateFrom(searchParams.cancel_request_date_from)
      this.onChangeCancelDateTo(searchParams.cancel_request_date_to)
      this.onChangeMrNo(searchParams.mr_no);
      this.onChangePatientName(searchParams.patient_name);

      this.pageChanged({page: searchParams.page_no, itemsPerPage: 0})
      // this.getAllInvoiceList()
    } else {
      window.sessionStorage.removeItem(ApprovalInvoiceCancellationSearchParam.PARAM_KEY)
    }
  }

  saveSearchParams() {
    let searchBody: ApprovalInvoiceCancellationSearchParam = {
      lob: this.selectedLob,
      invoice_no: this.invoice_no,
      invoice_date_from: this.invoice_date_from,
      invoice_date_to: this.invoice_date_to,
      cancel_request_date_from: this.cancel_date_from,
      cancel_request_date_to: this.cancel_date_to,
      page_no: this.current_page,
      mr_no: this.mr_no,
      patient_name: this.patientName,

    }
    window.sessionStorage.setItem(ApprovalInvoiceCancellationSearchParam.PARAM_KEY, JSON.stringify(searchBody));
  }

  navigateToDetail(invoiceNo: string, invCancellationId: string){
    this.router.navigate(['payment/approval-for-invoice-cancellation-detail', invoiceNo, invCancellationId])
  }

  getPatientEvent(e: any) {
    this.mr_no = e.mr_no;
    this.resetDataPatient = false
    this.params = this.params.set('mr_no', this.mr_no)
  }

  onChangeLob(selected: any){
    this.selectedLob = selected;
    this.params = this.params.set('lob_id', this.selectedLob.key)
  }

  onChangeInvoiceDateFrom(selected: any){
    this.invoice_date_from = selected;
    this.params = this.params.set('invoice_date_from', this.invoice_date_from)
  }

  onChangeInvoiceDateTo(selected: any){
    this.invoice_date_to = selected;
    this.params = this.params.set('invoice_date_to', this.invoice_date_to)
  }

  onChangeCancelDateFrom(selected: any){
    this.cancel_date_from = selected;
    this.params = this.params.set('cancel_date_from', this.cancel_date_from)
  }

  onChangeCancelDateTo(selected: any){
    this.cancel_date_to = selected;
    this.params = this.params.set('cancel_date_to', this.cancel_date_to)
  }

  onChangeInvoiceNo(event: any){
    this.invoice_no = event;
    this.params = this.params.set('invoice_no', this.invoice_no)
  }

  onChangePatientName(name: string) {
    this.params = this.params.set("patient_name", name)
  }

  onChangeMrNo(mrNo: number){
    this.params = this.params.set("mr_no", mrNo)
  }

  onReset(){
    this.selectedLob = {key: '', value: ''}
    this.invoice_no = ""
    this.invoice_date_from = ""
    this.invoice_date_to = ""
    this.cancel_date_from = ""
    this.cancel_date_to = ""
    this.resetDataPatient = true
    this.params = new HttpParams().set('page_no',1)
  }

  searchInvoiceList() {
    this.paging = new Paging(0, 0, 0, 0, 0)
    this.pageChanged({page: 1, itemsPerPage: 0})
  }

  getAllInvoiceList(event?: PageChangedEvent){
    this.saveSearchParams()

    this.progress = true;

    return this.invoiceCancellationService.getAll(this.params)
      .subscribe((data: GetInvoiceCancellationResponse)=>
      {
        this.getInvoiceResponse = {...data}
        if(this.getInvoiceResponse.response_code === RESPONSE_SUCCESS){
          this.listInvoice = this.getInvoiceResponse.cancel_appr_list
          PropertyCopier.copyProperties(this.getInvoiceResponse.paging, this.paging);
          if (event != undefined) this.page = event.page
        }else{
          this.alertService.showModalAlert(`Failed to get invoice list: ${this.getInvoiceResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false;
        this.searched = true
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get invoice list, please contact administration`, ALERT_DANGER)
        this.progress = false
        this.searched = true
      });
  }

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.current_page = event.page
    this.getAllInvoiceList(event);
  }

}
