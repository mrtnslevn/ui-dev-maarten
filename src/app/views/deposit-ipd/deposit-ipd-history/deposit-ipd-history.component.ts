import { formatDate } from '@angular/common'
import { HttpParams } from '@angular/common/http'
import { Component, OnInit, AfterContentInit } from '@angular/core'
import { ActivatedRoute } from '@angular/router'
import { Paging } from 'src/app/general/models/Paging'
import { Patient } from 'src/app/general/models/Patient'
import { DepositIpdService } from 'src/app/service/deposit-ipd.service'
import { ModalAlertService } from 'src/app/service/modal-alert.service'
import { PaymentService } from 'src/app/service/payment.service'
import { TokenStorageService } from 'src/app/_auth/token-storage.service'
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config'
import { DepositIpdHistoryResponse } from '../models/DepositIpdHistoryResponse.model'
import { DepositIpdHistory } from '../models/DepositIpdHistory.model'

@Component({
    selector: 'app-deposit-ipd-history',
    templateUrl: './deposit-ipd-history.component.html',
    styleUrls: ['./deposit-ipd-history.component.scss'],
})
export class DepositIpdHistoryComponent implements OnInit {
    constructor(
        private route: ActivatedRoute,
        private alertService: ModalAlertService,
        private paymentService: PaymentService,
        private depositIpdService: DepositIpdService,
        private token: TokenStorageService,
    ) { }

    // rest
    params: any
    loadPage: boolean = true
    progress: boolean = false
    depositIpdHistories: DepositIpdHistory[] = []
    searched: boolean = false
    responseDesc?: string
    loadPatient = true
    loadExportDepositIpdHistory = false

    // pagination properties
    paging: Paging = new Paging(0, 0, 0, 0, 0)
    page: number = 1


    orgId = this.token.getUserData().hope_organization_id
    mrNo: string = ''
    patientName: string = ''
    dateOfBirth: string = ''
    patient: Patient = Patient.default()
    fromDate: string = this.getTodaysDate()
    toDate: string = this.getTodaysDate()

    ngOnInit(): void {
        this.route.params.subscribe(params => {
            this.mrNo = params['mr_no']
            this.patientName = params['patient_name']
        })
        this.getPatientInfo()
    }

    getPatientInfo() {
        let params = new HttpParams()
            .set('patient_name', this.patientName)
            .set('page_no', 1)
            .set('mr_no', this.mrNo)
        this.paymentService.getPatientInfo(params).subscribe(data => {
            const { patient_list } = data
            this.patient = patient_list[0]
            this.loadPatient = false
        })
    }

    getDepositIpdHistory() {
        this.progress = true
        let params = new HttpParams()
            .set('mr_no', this.mrNo)
            .set('org_id', this.orgId)
            .set('deposit_date_from', this.fromDate)
            .set('deposit_date_to', this.toDate)
            .set('page_no', 1)
        this.depositIpdService.getDepositIpdHistory(params).subscribe(
            (data: DepositIpdHistoryResponse) => {
                if (data.response_code === RESPONSE_SUCCESS) {
                    this.searched = true
                    const { paging, deposit_history_list } = data
                    this.paging = paging
                    this.depositIpdHistories = deposit_history_list
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

    exportDepositHistory() {
        this.loadExportDepositIpdHistory = true
        const params = new HttpParams()
            .set('org_id', this.orgId)
            .set('mr_no', this.mrNo)
            .set('deposit_date_from', this.fromDate)
            .set('deposit_date_to', this.toDate)
            .set('export_file_type', "excel")
        this.depositIpdService.exportDepositIpdHistory(params).subscribe((data) => {
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
            this.loadExportDepositIpdHistory = false
        }, err => {
            console.log(err)
            this.alertService.showModalAlert(`Failed to export invoice, please contact administration`, ALERT_DANGER)
            this.loadExportDepositIpdHistory = false
        })
    }

    onClickExportDepositHistory() {
        this.exportDepositHistory()
    }

    getTodaysDate() {
        return formatDate(Date.now(), 'yyyy-MM-dd', 'en-US')
    }

    reset() {
        this.fromDate = this.getTodaysDate()
        this.toDate = this.getTodaysDate()
    }
    onClickReset() {
        this.reset()
    }
    onClickSearch() {
        this.getDepositIpdHistory()
    }
    formatDate(date: string | number | Date) {
        return formatDate(date, 'yyyy-MM-dd', 'en-US')
    }
    onChangeFromDate(date: Date) {
        const fromDate = this.formatDate(date)
        this.fromDate = fromDate
    }
    onchangeToDate(date: Date) {
        const toDate = this.formatDate(date)
        this.toDate = toDate
    }
}