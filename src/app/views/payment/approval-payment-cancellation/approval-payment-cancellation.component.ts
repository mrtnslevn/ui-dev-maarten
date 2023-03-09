import { Component, OnInit, ViewChild } from '@angular/core';
import { PaymentCancellationService } from 'src/app/service/payment-cancellation.service';
import { Router } from '@angular/router';
import { PaymentLob } from 'src/app/general/models/PaymentLob';
import { GeneralService } from 'src/app/service/general.service';
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { PaymentMode } from 'src/app/general/models/PaymentMode';
import { HttpParams } from '@angular/common/http';
import { GetPaymentCancellationResponse } from 'src/app/general/models/response/GetPaymenCancellationResponse';
import { CancelApprovalPayment } from 'src/app/general/models/CancelApprovalPayment';
import { Patient } from 'src/app/general/models/Patient';
import { Paging } from 'src/app/general/models/Paging';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { ApprovalPaymentCancellationSearchParam } from 'src/app/general/models/search-param/ApprovalPaymentCancellationSearchParam';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-approval-payment-cancellation',
  templateUrl: './approval-payment-cancellation.component.html',
  styleUrls: ['./approval-payment-cancellation.component.scss']
})
export class ApprovalPaymentCancellationComponent implements OnInit {

  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent
  lob_id: number = 0
  invoice_no: string = ""
  settlement_date_from: string = ""
  settlement_date_to: string = ""
  cancel_date_from: string = ""
  cancel_date_to: string = ""
  mr_no: any = ""
  page_no: number = 0
  patientName: string = ""

  private _selectedPatient: Patient = Patient.defaultWithoutMrNo()
  set selectedPatient(value: Patient) {
    this._selectedPatient = value
    this.getPatientEvent(this._selectedPatient)
  }

  get selectedPatient() {
    return this._selectedPatient
  }
  
  getPaymentCancellationResponse: any = {}
  listPayment: CancelApprovalPayment[] = []

  getListResponse!: GetListResponse

  defaultLob: PaymentLob = PaymentLob.default()
  listLob: PaymentLob[] = [this.defaultLob]
  selectedLob: PaymentLob = this.defaultLob
  
  defaultPaymentMode: PaymentMode = PaymentMode.default()
  listPaymentMode: PaymentMode[] = [this.defaultPaymentMode]
  selectedPaymentMode: PaymentMode = this.defaultPaymentMode

  loadPage: boolean = true
  params: HttpParams = new HttpParams().set("page_no", 1)

  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page?: number
  current_page = 1
  searched: boolean = false
  resetDataPatient: boolean = false

  constructor(private paymentCancellationService: PaymentCancellationService, private router: Router,
    private generalService: GeneralService, private alertService: ModalAlertService) { }

  public progress: boolean = false;
  bsModalShowAlert?: BsModalRef

  ngOnInit(): void {
    this.getList()
    this.settlement_date_from = this.getTodaysDate()
    this.settlement_date_to = this.getTodaysDate()
    this.cancel_date_from = this.getTodaysDate()
    this.cancel_date_to = this.getTodaysDate()

    this.params = this.params
    .set('settlement_date_from', this.settlement_date_from)
    .set('settlement_date_to', this.settlement_date_to)
    .set('cancel_date_from',this.cancel_date_from)
    .set('cancel_date_to',this.cancel_date_to)
  }

  getTodaysDate() {
    return formatDate(Date.now(), "yyyy-MM-dd", "en-US")
  }

  getList(){
    const params = new HttpParams()
    .set('param_list', 'paymentLobList')
    .append('param_list','paymentModeListForPayment');

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.getListResponse.paymentLobList.forEach(l => {
            this.listLob.push(l)
          })
          this.getListResponse.paymentModeListForPayment.forEach(p => {
            this.listPaymentMode.push(p)
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
    // get search params and search approval payment cancellation list
    if (history.state.fromDetail) {
      let param: string = window.sessionStorage.getItem(ApprovalPaymentCancellationSearchParam.PARAM_KEY)!
      let searchParams: ApprovalPaymentCancellationSearchParam = JSON.parse(param)

      let lob = this.listLob.find(l => l.key == searchParams.lob.key);
      let paymentMode = this.listPaymentMode.find(p => p.key == searchParams.payment_mode.key)

      this.onChangeLob(lob)
      this.onChangeInvoiceNo(searchParams.invoice_no)
      this.onChangePaymentMode(paymentMode)
      this.onChangeSettlementDateFrom(searchParams.settlement_date_from)
      this.onChangeSettlementDateTo(searchParams.settlement_date_to)
      this.onChangeCancelDateFrom(searchParams.cancel_request_date_from)
      this.onChangeCancelDateTo(searchParams.cancel_request_date_to)
      this.onChangeMrNo(searchParams.mr_no);
      this.onChangePatientName(searchParams.patient_name);

      this.pageChanged({page: searchParams.page_no, itemsPerPage: 0})
      // this.getAllPaymentList()
    } else {
      window.sessionStorage.removeItem(ApprovalPaymentCancellationSearchParam.PARAM_KEY)
    }
  }

  saveSearchParams() {
    let searchBody: ApprovalPaymentCancellationSearchParam = {
      lob: this.selectedLob,
      invoice_no: this.invoice_no,
      payment_mode: this.selectedPaymentMode,
      settlement_date_from: this.settlement_date_from,
      settlement_date_to: this.settlement_date_to,
      cancel_request_date_from: this.cancel_date_from,
      cancel_request_date_to: this.cancel_date_to,
      page_no: this.current_page,
      mr_no: this.mr_no,
      patient_name: this.patientName,
    }
    window.sessionStorage.setItem(ApprovalPaymentCancellationSearchParam.PARAM_KEY, JSON.stringify(searchBody));
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

  onChangePaymentMode(selected: any){
    this.selectedPaymentMode = selected;
    this.params = this.params.set('payment_mode_id', this.selectedPaymentMode.key)
  }

  onChangeSettlementDateFrom(selected: any){
    this.settlement_date_from = selected;
    this.params = this.params.set('settlement_date_from', this.settlement_date_from)
  }

  onChangeSettlementDateTo(selected: any){
    this.settlement_date_to = selected;
    this.params = this.params    .set('settlement_date_to', this.settlement_date_to)
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
    this.patientName = name;
    this.params = this.params.set("patient_name", name)
  }

  onChangeMrNo(mrNo: number){
    this.mr_no = mrNo;
    this.params = this.params.set("mr_no", mrNo)
  }

  onReset(){
    this.invoice_no = ""
    this.cancel_date_to = ""
    this.cancel_date_from = ""
    this.settlement_date_from = ""
    this.settlement_date_to = ""
    this.selectedLob = {key: '', value: ''}
    this.selectedPaymentMode = {key: '', value: ''}
    this.resetDataPatient = true
    this.params = new HttpParams().set('page_no',1)
  }

  navigateToDetails(payment_cancellation_id: string, invoice_no: string, settlement_no: string): void {
    this.router.navigate(['payment/approval-for-payment-cancellation-detail',payment_cancellation_id, invoice_no, settlement_no])
  }

  searchPaymentList() {
    this.paging = new Paging(0, 0, 0, 0, 0)
    this.pageChanged({page: 1, itemsPerPage: 0})
  }

  getAllPaymentList(event?: PageChangedEvent ){
    this.saveSearchParams()

    this.progress = true;
    
    return this.paymentCancellationService.getAll(this.params)
      .subscribe((data: GetPaymentCancellationResponse)=>
      {
        this.getPaymentCancellationResponse = {...data}
        if(this.getPaymentCancellationResponse.response_code === RESPONSE_SUCCESS){
          this.listPayment = this.getPaymentCancellationResponse.cancel_appr_list;
          PropertyCopier.copyProperties(this.getPaymentCancellationResponse.paging, this.paging);
          
          if (event != undefined) this.page = event.page;
        }else{
          this.alertService.showModalAlert(`Failed to get payment list : ${this.getPaymentCancellationResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false;
        this.loadPage = false
        this.searched = true
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get payment list, please contact administration`, ALERT_DANGER)
        this.progress = false;
        this.loadPage = false
        this.searched = true
      });
  }

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.current_page = event.page
    this.getAllPaymentList(event);
  }

}
