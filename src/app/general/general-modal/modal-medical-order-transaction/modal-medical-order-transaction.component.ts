import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaymentService } from 'src/app/service/payment.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { Patient } from '../../models/Patient';
import { GetMedicalOrderTransactionResponse } from '../../models/response/GetMedicalOrderTransactionResponse';
import { Pagination } from 'src/app/_helpers/pagination';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { Paging } from '../../models/Paging';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { MedicalOrderTransaction } from '../../models/MedicalOrderTransaction';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-modal-medical-order-transaction',
  templateUrl: './modal-medical-order-transaction.component.html',
  styleUrls: ['./modal-medical-order-transaction.component.scss']
})
export class ModalMedicalOrderTransactionComponent implements OnInit {

  loadPage: boolean = false;
  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent

  editableModal?: boolean
  dataMedicalOrderTransaction: Array<MedicalOrderTransaction> = []
  @Output() dataOutputMedicalOrderTransaction = new EventEmitter<MedicalOrderTransaction[]>()
  
  paging: Paging = new Paging(0, 0, 0, 0, 0)
  current_page: number = 1;
  page?: number;
  
  admissionDateTo: string = ""
  admissionDateFrom: string = ""

  getDataFromTable: Array<MedicalOrderTransaction> = []

  getMedicalOrderTransactionResponse: GetMedicalOrderTransactionResponse | undefined;

  @Input() patientId: number = 0
  @Input() admissionId: number = 0

  params: HttpParams = new HttpParams().set("page_no", 1);
  
  constructor(public bsModalRef: BsModalRef, private paymentService: PaymentService,
    private alertService: ModalAlertService) { }

  ngOnInit(): void {
    // this.getDataMedicalOrderTransaction()
    this.admissionDateTo = this.getTodaysDate()
    this.admissionDateFrom = this.getTodaysDate()
  }

  getDataMedicalOrderTransaction(event?: PageChangedEvent){
    this.loadPage = true;
    if (this.patientId != null && this.patientId != undefined && 
      this.patientId > 0) {
      this.params = this.params.set("order_start_date", this.admissionDateFrom)
      .set("order_end_date", this.admissionDateTo)
      .set("admission_id", this.admissionId)
      .set("patient_id", this.patientId);
    }

    this.paymentService.getMedicalOrder(this.params).subscribe((data: GetMedicalOrderTransactionResponse) => {
      this.getMedicalOrderTransactionResponse = {...data};

      if (this.getMedicalOrderTransactionResponse.response_code === RESPONSE_SUCCESS) {
        this.dataMedicalOrderTransaction = this.getMedicalOrderTransactionResponse.medical_order_list;
        this.paging = PropertyCopier.clone(this.getMedicalOrderTransactionResponse.paging, this.paging);

        if (event != undefined) this.page = event.page;
        else if (this.paginationComp != undefined) {
          Pagination.setPaginationComp(this.paging, this.paginationComp)
        }
      }else{
        this.alertService.showModalAlert(`Failed to get prepaid list: ${this.getMedicalOrderTransactionResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadPage = false;
    }, err => {
      this.loadPage = false;
      this.alertService.showModalAlert(`An error has occured while get prepaid list, please contact administration`, ALERT_DANGER)
    });
  }

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.getDataMedicalOrderTransaction(event);
  }

  onChangeAdmissionDateFrom(admissionDateFrom: string) {
    this.admissionDateFrom = admissionDateFrom
    this.params = this.params.set("order_start_date", this.admissionDateFrom)
  }

  onChangeAdmissionDateTo(admissionDateTo: string) { 
    this.admissionDateTo = admissionDateTo
    this.params = this.params.set("order_end_date", this.admissionDateTo)
  }

  getTodaysDate() {
    return formatDate(Date.now(), "yyyy-MM-dd", "en-US")
  }

  getMedicalOrderData(data: MedicalOrderTransaction[]){
    this.getDataFromTable = data;
  }

  addData(){
    this.dataOutputMedicalOrderTransaction.emit(this.getDataFromTable);
    console.log(this.getDataFromTable);
    this.bsModalRef.hide();
  }


}
