import { formatDate } from '@angular/common';
import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalDocumentViewComponent } from 'src/app/general/general-modal/modal-document-view/modal-document-view.component';
import { ModalSendPrintDepositComponent } from 'src/app/general/general-modal/modal-send-print-deposit/modal-send-print-deposit.component';
import { Patient } from 'src/app/general/models/Patient';
import { DepositIpdService } from 'src/app/service/deposit-ipd.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { PaymentService } from 'src/app/service/payment.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, ALERT_SUCCESS, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { DepositIpdDepositor } from '../models/DepositIpdDepositor.model';
import { DepositIpdHistory } from '../models/DepositIpdHistory.model';
import { DepositIpdHistoryResponse } from '../models/DepositIpdHistoryResponse.model';
import { DepositIpdPaymentSettlement } from '../models/DepositIpdPaymentSettlement.model';

@Component({
  selector: 'app-deposit-ipd-transaction-detail',
  templateUrl: './deposit-ipd-transaction-detail.component.html',
  styleUrls: ['./deposit-ipd-transaction-detail.component.scss']
})
export class DepositIpdTransactionDetailComponent implements OnInit {

  constructor(
    private alertService: ModalAlertService,
    private depositIpdService: DepositIpdService,
    private router: Router,
    private token: TokenStorageService,
    private paymentService: PaymentService,
    private route: ActivatedRoute,
    public bsModalService: BsModalService,
    private sanitizer: DomSanitizer,
  ) { }

  mrNo: string = ''
  patientName: string = ''
  transactionNo: string = ''
  admissionNo: string = ''
  orgId = this.token.getUserData().hope_organization_id;
  depositIpdHistories: DepositIpdHistory[] = []
  patient: Patient = Patient.default()
  depositor?: DepositIpdDepositor
  depositIpdPaymentSettlement?: DepositIpdPaymentSettlement
  file: any

  loadPatient: boolean = false
  loadDepositIpdHistory: boolean = false
  loadExportDepositIpdHistory: boolean = false
  loadPrintReceipt: boolean = false

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.transactionNo = params['transaction_no'];
      this.mrNo = params['mr_no'];
      this.patientName = params['patient_name'];
      this.admissionNo = params['admission_no'];
    })
    this.getDepositIpdTransactionDetail()
    this.getPatientInfo()
    this.getDepositIpdHistory()
  }

  getDepositIpdTransactionDetail() {
    const params = new HttpParams()
      .set('org_id', this.orgId)
      .set('deposit_no', this.transactionNo)
    this.depositIpdService.getDepositIpdTransactionDetail(params).subscribe((data) => {
      if (data.response_code === RESPONSE_SUCCESS) {
        const { log_depositor, deposit_detail } = data
        this.depositor = log_depositor
        this.depositIpdPaymentSettlement = deposit_detail

        this.getDepositIpdDocument()
      } else {
        this.alertService.showModalAlert(`Failed to get service: ${data.response_desc}`, ALERT_DANGER)
      }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get service, please contact administration`, ALERT_DANGER)
    })
  }

  getPatientInfo() {
    this.loadPatient = true
    let params = new HttpParams()
      .set('patient_name', this.patientName)
      .set('page_no', 1)
      .set('mr_no', this.mrNo);
    this.paymentService.getPatientInfo(params).subscribe(data => {
      if (data.response_code === RESPONSE_SUCCESS) {
        const { patient_list } = data
        this.patient = patient_list[0]
        this.loadPatient = false
      } else {
        this.alertService.showModalAlert(`Failed to get service: ${data.response_desc}`, ALERT_DANGER)
      }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get service, please contact administration`, ALERT_DANGER)
    })
  }
  getDepositIpdHistory() {
    this.loadDepositIpdHistory = true;
    let params = new HttpParams()
      .set('mr_no', this.mrNo)
      .set('org_id', this.orgId)
      .set('admission_no', this.admissionNo)
      .set('page_no', 1)
    this.depositIpdService.getDepositIpdHistory(params).subscribe(
      (data: DepositIpdHistoryResponse) => {
        if (data.response_code === RESPONSE_SUCCESS) {
          const { paging, deposit_history_list } = data
          // this.paging = paging
          this.depositIpdHistories = deposit_history_list
        } else {
          this.alertService.showModalAlert(`Failed to get service: ${data.response_desc}`, ALERT_DANGER)
        }
        this.loadDepositIpdHistory = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get service, please contact administration`, ALERT_DANGER)
        this.loadDepositIpdHistory = false
      }
    )
  }

  getDepositIpdDocument() {
    if (!this.depositor) return
    this.loadDepositIpdHistory = true;
    let params = new HttpParams()
      .set('file_path', this.depositor.identity_file_path)
    this.depositIpdService.getDepositIpdDocument(params).subscribe(
      (data) => {
        let urlCreator = window.URL || window.webkitURL;
        let imageUrl = urlCreator.createObjectURL(data.body);
        console.log(imageUrl)
        this.file = this.sanitizer.bypassSecurityTrustUrl(imageUrl)
        // if (data.headers.get("response_code") != "00") {

        // } else {
        //   this.alertService.showModalAlert(`Failed to get service: ${data.response_desc}`, ALERT_DANGER)
        // }
        this.loadDepositIpdHistory = false
      }, err => {
        console.log(err)
        this.alertService.showModalAlert(`An error has occured while get service, please contact administration`, ALERT_DANGER)
        this.loadDepositIpdHistory = false
      }
    )
  }

  printReceipt(invoiceType: string) {
    this.loadPrintReceipt = true;

    const params = {
      org_id: this.orgId,
      invoice_type: invoiceType,
      deposit_no: this.transactionNo,
      print_ori_many_times: true
    }
    this.depositIpdService.getReportDepositIpdReceipt(params).subscribe((data) => {
      if (data.headers.get("response_code") != "00") {
        this.alertService.showModalAlert(`Failed to print report: ${data.headers.get("response_desc")}`, ALERT_DANGER)
      } else {
        let blob = data.body as Blob;
        let downloadUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');

        a.href = downloadUrl;
        a.target = "_blank";
        a.click();
      }
      this.loadPrintReceipt = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while print report payment, please contact administration`, ALERT_DANGER)
      this.loadPrintReceipt = false;
    })
  }

  sendReceipt(invoiceType: string, whatsapp: string, email: string) {
    this.loadPrintReceipt = true;

    const params = {
      org_id: this.orgId,
      invoice_type: invoiceType,
      deposit_no: this.transactionNo,
      whatsapp: whatsapp,
      email: email,
      print_ori_many_times: true
    }

    this.depositIpdService.getReportDepositIpdSendReceipt(params).subscribe((data) => {
      if (data.response_code == RESPONSE_SUCCESS) {
        this.alertService.showModalAlert(`Report paymment is successfully sent`, ALERT_SUCCESS)
      } else {
        this.alertService.showModalAlert(`Failed to send report payment: ${data.response_desc}`, ALERT_DANGER)
      }
      this.loadPrintReceipt = false
    }, err => {
      this.alertService.showModalAlert(`An error has occured while print report payment, please contact administration`, ALERT_DANGER)
      this.loadPrintReceipt = false;
    })
  }

  exportDepositHistory() {
    this.loadExportDepositIpdHistory = true;
    const params = new HttpParams()
      .set('org_id', this.orgId)
      .set('admission_no', this.admissionNo)
      .set('mr_no', this.mrNo)
      .set('export_file_type', "excel")
    this.depositIpdService.exportDepositIpdHistory(params).subscribe((data) => {
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
      this.loadExportDepositIpdHistory = false;
    }, err => {
      console.log(err)
      this.alertService.showModalAlert(`Failed to export invoice, please contact administration`, ALERT_DANGER)
      this.loadExportDepositIpdHistory = false;
    });
  }

  onClickExportDepositHistory() {
    this.exportDepositHistory()
  }

  onClickPrintReceipt(data: any) {
    this.printReceipt(data.type)
  }

  onClickSendReceipt(data: any) {
    this.sendReceipt(data.type, data.whatsapp, data.email)
  }


  toggleReceiptModal(invoiceType: string) {
    const initialState: ModalOptions = {
      initialState: {
        // whatsapp: this.patient.contact_no,
        // email: this.patient.email,
        whatsapp: '085723493029',
        email: 'idamfadilah.9c@gmail.com',
        type: invoiceType,
        printOriManyTimes: true,
        onLoad: this.loadPrintReceipt,
        onPrintReceipt: (e: any) => { return this.onClickPrintReceipt(e) },
        onSendReceipt: (e: any) => { return this.onClickSendReceipt(e) },
      },
    }
    this.bsModalService.show(ModalSendPrintDepositComponent, initialState)
  }

  onClickViewDocument() {
    const initialState: ModalOptions = {
      initialState: {
        file: this.file,
      },
    }
    this.bsModalService.show(ModalDocumentViewComponent, initialState)
  }

  formatDate(date: string | number | Date) {
    return formatDate(date, 'yyyy-MM-dd', 'en-US')
  }

}