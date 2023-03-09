import { formatDate } from '@angular/common'
import { HttpParams } from '@angular/common/http'
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination'
import { Paging } from 'src/app/general/models/Paging'
import { DepositIpdService } from 'src/app/service/deposit-ipd.service'
import { ModalAlertService } from 'src/app/service/modal-alert.service'
import { TokenStorageService } from 'src/app/_auth/token-storage.service'
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config'
import { DepositIpdTransaction, DepositIpdTransactionSearch, DEPOSIT_IPD_TRANSACTION_SEARCH_KEY } from '../models/DepositIpdTransaction.model'
import { DepositIpdTransactionResponse } from '../models/DepositIpdTransactionResponse.model'


@Component({
  selector: 'app-deposit-ipd-transaction',
  templateUrl: './deposit-ipd-transaction.component.html',
  styleUrls: ['./deposit-ipd-transaction.component.scss'],
})
export class DepositIpdTransactionComponent implements OnInit {
  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent

  constructor(
    private alertService: ModalAlertService,
    private depositIpdService: DepositIpdService,
    private router: Router,
    private token: TokenStorageService,
  ) { }

  // rest
  params: any
  loadPage: boolean = true
  progress: boolean = false
  depositTransaction: DepositIpdTransaction[] = []
  searched: boolean = false
  responseDesc?: string
  loadExportDepositTransaction: boolean = false

  // date for filter transaction
  lastTransactionDateFrom: string = this.getTodaysDate()
  lastTransactionDateTo: string = this.getTodaysDate()

  // patient information data
  mrNo: number|string = ''
  patientName?: string
  dateOfBirth?: string
  depositNo?: string
  orgId = this.token.getUserData().hope_organization_id;


  // pagination properties
  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page: number = 1

  ngOnInit(): void {
    let sessionParam = window.sessionStorage.getItem(DEPOSIT_IPD_TRANSACTION_SEARCH_KEY)
    if (!sessionParam) return
    if (history.state.fromDetail) {
      const params: DepositIpdTransactionSearch = JSON.parse(sessionParam)
      const { last_transaction_date_from, last_transaction_date_to, mr_no, patient_name, dob, page_no } = params
      console.log(last_transaction_date_from, last_transaction_date_to, mr_no, patient_name, dob, page_no)
      this.lastTransactionDateFrom = this.formatDate(last_transaction_date_from)
      this.lastTransactionDateTo = this.formatDate(last_transaction_date_to)
      this.page = page_no
      if (mr_no) this.mrNo = mr_no
      if (patient_name) this.patientName = patient_name
      if (dob) this.dateOfBirth = this.formatDate(dob)
      this.getDepositIpdTransaction(this.page)
    } else {
      window.sessionStorage.removeItem(DEPOSIT_IPD_TRANSACTION_SEARCH_KEY)
    }

  }

  formatDate(date: string | number | Date) {
    return formatDate(date, 'yyyy-MM-dd', 'en-US')
  }

  getTodaysDate() {
    return this.formatDate(Date.now())
  }

  onChangeLastTransactionDateFrom(date: Date) {
    const dateFrom = this.formatDate(date)
    this.lastTransactionDateFrom = dateFrom
  }

  onChangeLastTransactionDateTo(date: Date) {
    const dateTo = this.formatDate(date)
    this.lastTransactionDateTo = dateTo
  }

  onChangeMrNo(event: Event) {
    this.mrNo = parseInt(event + '')
  }

  onChangePatientName(event: Event) {
    this.patientName = event + ''
  }

  onChangeDateOfBirth(event: Event) {
    this.dateOfBirth = event + ''
  }

  onChangeDepositNo(event: Event) {
    this.depositNo = event + ''
  }

  onChangePage(event: PageChangedEvent) {
    const { page } = event
    this.page = page
    this.getDepositIpdTransaction(page);
  }
  saveSearchParams() {
    const search = {
      last_transaction_date_from: this.lastTransactionDateFrom,
      last_transaction_date_to: this.lastTransactionDateTo,
      mr_no: this.mrNo,
      patient_name: this.patientName,
      deposit_no: this.depositNo,
      dob: this.dateOfBirth,
      page_no: this.page
    }
    window.sessionStorage.setItem(DEPOSIT_IPD_TRANSACTION_SEARCH_KEY, JSON.stringify(search))
  }
  exportDepositTransaction() {
    this.loadExportDepositTransaction = true;
    let params = new HttpParams()
      .set('org_id', this.orgId)
      .set('export_file_type', "excel")
      if (this.mrNo) params = params.append('mr_no', this.mrNo)
      if (this.depositNo) params = params.append('deposit_no', this.depositNo)
      if (this.patientName) params = params.append('patient_name', this.patientName)
      if (this.dateOfBirth) params = params.append('dob', this.dateOfBirth)
      if (this.lastTransactionDateFrom) params = params.append('deposit_date_from', this.lastTransactionDateFrom)
      if (this.lastTransactionDateTo) params = params.append('deposit_date_to', this.lastTransactionDateTo)
    this.depositIpdService.exportDepositIpdTransaction(params).subscribe((data) => {
      if (data.headers.get("response_code") != "00") {
        this.alertService.showModalAlert(`Failed to export file: ${data.headers.get("response_desc")}`, ALERT_DANGER)
      } else {
        let blob = data.body as Blob;
        let filename: string = data.headers.get("content-disposition").split(";")[1].split("=")[1].replace(/"/g, '');
        var downloadUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        a.click();
      }
      this.loadExportDepositTransaction = false;
    }, err => {
      console.log(err)
      this.alertService.showModalAlert(`Failed to export invoice, please contact administration`, ALERT_DANGER)
      this.loadExportDepositTransaction = false;
    });
  }

  getDepositIpdTransaction(page: number) {
    this.saveSearchParams()
    this.progress = true;
    const { hope_organization_id: org_id } = this.token.getUserData();
    let params = new HttpParams()
      .set('page_no', page)
      .set('org_id', org_id)

    if (this.mrNo) params = params.append('mr_no', this.mrNo)
    if (this.depositNo) params = params.append('deposit_no', this.depositNo)
    if (this.patientName) params = params.append('patient_name', this.patientName)
    if (this.dateOfBirth) params = params.append('dob', this.dateOfBirth)
    if (this.lastTransactionDateFrom) params = params.append('deposit_date_from', this.lastTransactionDateFrom)
    if (this.lastTransactionDateTo) params = params.append('deposit_date_to', this.lastTransactionDateTo)

    this.depositIpdService.getDepositIpdTransaction(params).subscribe((data: DepositIpdTransactionResponse) => {
      if (data.response_code === RESPONSE_SUCCESS) {
        this.searched = true
        const { payment_settlement_list, paging, response_desc } = data
        this.depositTransaction = payment_settlement_list
        this.responseDesc = response_desc
        this.paging = paging
      } else {
        this.alertService.showModalAlert(`Failed to get service: ${this.responseDesc}`, ALERT_DANGER)
      }
      this.progress = false
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get service, please contact administration`, ALERT_DANGER)
      this.progress = false
    })
  }

  clearSearchParams() {
    this.lastTransactionDateFrom = this.getTodaysDate()
    this.lastTransactionDateTo = this.getTodaysDate()
    this.dateOfBirth = ''
    this.mrNo = 0
    this.patientName = ''
    this.depositNo = ''
    this.page = 1
  }


  onClickSearch() {

    this.getDepositIpdTransaction(1)
  }

  onClickReset() {
    this.clearSearchParams()
    window.sessionStorage.removeItem(DEPOSIT_IPD_TRANSACTION_SEARCH_KEY)
  }

  onClickExport(){
    this.exportDepositTransaction()
  }

  navigateToDetails(transaction_no: string, mr_no: number, patient_name: string, admission_no: string) {
    this.router.navigate(['deposit-ipd/deposit-ipd-transaction-detail', transaction_no, mr_no, patient_name, admission_no])
  }

}
