import { formatDate } from '@angular/common'
import { HttpParams } from '@angular/common/http'
import { Component, OnInit, ViewChild } from '@angular/core'
import { Router } from '@angular/router'
import { PaginationComponent, PageChangedEvent } from 'ngx-bootstrap/pagination'
import { Paging } from 'src/app/general/models/Paging'
import { DepositIpdService } from 'src/app/service/deposit-ipd.service'
import { ModalAlertService } from 'src/app/service/modal-alert.service'
import { TokenStorageService } from 'src/app/_auth/token-storage.service'
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config'
import { DepositIpdListResponse } from '../models/DepositIpdListResponse.model'
import { DepositIpdList, DepositIpdListSearch, DEPOSIT_IPD_LIST_SEARCH_KEY } from '../models/DepositIpdList.model'


@Component({
  selector: 'app-deposit-ipd-list',
  templateUrl: './deposit-ipd-list.component.html',
  styleUrls: ['./deposit-ipd-list.component.scss'],
})
export class DepositIpdListComponent implements OnInit {

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
  depositList: DepositIpdList[] = []
  searched: boolean = false
  responseDesc?: string
  loadExportDepositIpdList: boolean = false

  // date for filter transaction
  lastTransactionDateFrom: string = this.getTodaysDate()
  lastTransactionDateTo: string = this.getTodaysDate()

  // patient information data
  mrNo?: number | string
  patientName?: string
  dateOfBirth?: string
  orgId = this.token.getUserData().hope_organization_id


  // for storing deposit list 
  depositIpdList: DepositIpdList[] = []

  // pagination properties
  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page: number = 1

  ngOnInit(): void {
    let sessionParam = window.sessionStorage.getItem(DEPOSIT_IPD_LIST_SEARCH_KEY)
    if (!sessionParam) return
    if (history.state.fromDetail) {
      const params: DepositIpdListSearch = JSON.parse(sessionParam)
      const { last_transaction_date_from, last_transaction_date_to, mr_no, patient_name, dob, page_no } = params
      console.log(last_transaction_date_from, last_transaction_date_to, mr_no, patient_name, dob, page_no)
      this.lastTransactionDateFrom = this.formatDate(last_transaction_date_from)
      this.lastTransactionDateTo = this.formatDate(last_transaction_date_to)
      this.page = page_no
      if (mr_no) this.mrNo = mr_no
      if (patient_name) this.patientName = patient_name
      if (dob) this.dateOfBirth = this.formatDate(dob)
      this.getDepositIpdList(this.page)
    } else {
      window.sessionStorage.removeItem(DEPOSIT_IPD_LIST_SEARCH_KEY)
    }


  }

  formatDate(date: string | number | Date) {
    return formatDate(date, 'yyyy-MM-dd', 'en-US')
  }

  getTodaysDate() {
    return this.formatDate(Date.now())
  }

  saveSearchParams() {
    const search = {
      last_transaction_date_from: this.lastTransactionDateFrom,
      last_transaction_date_to: this.lastTransactionDateTo,
      mr_no: this.mrNo,
      patient_name: this.patientName,
      dob: this.dateOfBirth,
      page_no: this.page
    }
    window.sessionStorage.setItem(DEPOSIT_IPD_LIST_SEARCH_KEY, JSON.stringify(search))
  }

  clearSearchParams() {
    this.lastTransactionDateFrom = this.getTodaysDate()
    this.lastTransactionDateTo = this.getTodaysDate()
    this.dateOfBirth = ''
    this.mrNo = 0
    this.patientName = ''
    this.page = 1
  }

  getDepositIpdList(page: number) {
    this.saveSearchParams()
    this.progress = true

    let params = new HttpParams()
      .set('page_no', page)
      .set('org_id', this.orgId)

    if (this.mrNo) params = params.append('mr_no', this.mrNo)
    if (this.patientName) params = params.append('patient_name', this.patientName)
    if (this.dateOfBirth) params = params.append('dob', this.dateOfBirth)
    if (this.lastTransactionDateFrom) params = params.append('deposit_date_from', this.lastTransactionDateFrom)
    if (this.lastTransactionDateTo) params = params.append('deposit_date_to', this.lastTransactionDateTo)

    this.depositIpdService.getDepositIpdList(params).subscribe(
      (data: DepositIpdListResponse) => {
        if (data.response_code === RESPONSE_SUCCESS) {
          this.searched = true
          const { paging, master_deposit_list, response_desc } = data
          this.responseDesc = response_desc
          this.paging = paging
          this.depositIpdList = master_deposit_list
        } else {
          this.alertService.showModalAlert(`Failed to get service: ${this.responseDesc}`, ALERT_DANGER)
        }
        this.progress = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get service, please contact administration`, ALERT_DANGER)
        this.progress = false
      }
    )
  }

  exportDepositIpdList() {
    this.loadExportDepositIpdList = true
    let params = new HttpParams()
      .set('org_id', this.orgId)
      .set('export_file_type', "excel")
    if (this.mrNo) params = params.append('mr_no', this.mrNo)
    if (this.patientName) params = params.append('patient_name', this.patientName)
    if (this.dateOfBirth) params = params.append('dob', this.dateOfBirth)
    if (this.lastTransactionDateFrom) params = params.append('deposit_date_from', this.lastTransactionDateFrom)
    if (this.lastTransactionDateTo) params = params.append('deposit_date_to', this.lastTransactionDateTo)

    this.depositIpdService.exportDepositIpdList(params).subscribe((data) => {
      if (data.headers.get("response_code") != "00") {
        this.alertService.showModalAlert(`Failed to export file: ${data.headers.get("response_desc")}`, ALERT_DANGER)
      } else {
        let blob = data.body as Blob
        let filename: string = data.headers.get("content-disposition").split(";")[1].split("=")[1].replace(/"/g, '')
        var downloadUrl = window.URL.createObjectURL(blob)
        let a = document.createElement('a')
        a.href = downloadUrl
        a.download = filename
        a.click()
      }
      this.loadExportDepositIpdList = false
    }, err => {
      console.log(err)
      this.alertService.showModalAlert(`Failed to export invoice, please contact administration`, ALERT_DANGER)
      this.loadExportDepositIpdList = false
    })
  }

  // EVENT

  onClickReset() {
    this.clearSearchParams()
    window.sessionStorage.removeItem(DEPOSIT_IPD_LIST_SEARCH_KEY)
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

  onChangePage(event: PageChangedEvent) {
    const { page } = event
    this.page = page
    this.getDepositIpdList(page)
  }

  onClickExport() {
    this.exportDepositIpdList()
  }

  navigateToDetails(mrNo: number, patientName: string) {
    this.router.navigate(['deposit-ipd/deposit-ipd-history', mrNo, patientName])
  }
}
