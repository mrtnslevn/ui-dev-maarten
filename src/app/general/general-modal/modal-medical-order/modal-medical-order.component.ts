import { HttpParams } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaymentService } from 'src/app/service/payment.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { MedicalOrder } from '../../models/MedicalOrder';
import { Patient } from '../../models/Patient';
import { GetMedicalOrderResponse } from '../../models/response/GetMedicalOrderResponse';
import { Pagination } from 'src/app/_helpers/pagination';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { Paging } from '../../models/Paging';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { ModalAlertService } from 'src/app/service/modal-alert.service';

@Component({
  selector: 'app-modal-medical-order',
  templateUrl: './modal-medical-order.component.html',
  styleUrls: ['./modal-medical-order.component.scss']
})
export class ModalMedicalOrderComponent implements OnInit {

  loadPage: boolean = false;
  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent

  editableModal?: boolean
  dataMedicalOrder: Array<MedicalOrder> = []
  
  paging: Paging = new Paging(0, 0, 0, 0, 0)
  current_page: number = 1;
  page?: number;

  getMedicalOrderResponse: GetMedicalOrderResponse | undefined;

  patientInfo: Patient = Patient.default()

  params: HttpParams = new HttpParams().set("page_no", 1);
  
  constructor(public bsModalRef: BsModalRef, private paymentService: PaymentService,
    private alertService: ModalAlertService) { }

  ngOnInit(): void {
    this.getDataMedicalOrder()
  }

  getDataMedicalOrder(event?: PageChangedEvent){
    this.loadPage = true;
    if (this.patientInfo.patient_id != null && this.patientInfo.patient_id != undefined && 
      this.patientInfo.patient_id > 0) {
      this.params = this.params.set("patient_id", `${this.patientInfo.patient_id}`);
    }

    this.paymentService.getMedicalOrder(this.params).subscribe((data: GetMedicalOrderResponse) => {
      this.getMedicalOrderResponse = {...data};

      if (this.getMedicalOrderResponse.response_code === RESPONSE_SUCCESS) {
        this.dataMedicalOrder = this.getMedicalOrderResponse.medical_order_list;
        this.paging = PropertyCopier.clone(this.getMedicalOrderResponse.paging, this.paging);

        if (event != undefined) this.page = event.page;
        else if (this.paginationComp != undefined) {
          Pagination.setPaginationComp(this.paging, this.paginationComp)
        }
      }else{
        this.alertService.showModalAlert(`Failed to get prepaid list: ${this.getMedicalOrderResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadPage = false;
    }, err => {
      this.loadPage = false;
      this.alertService.showModalAlert(`An error has occured while get prepaid list, please contact administration`, ALERT_DANGER)
    });
  }

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.getDataMedicalOrder(event);
  }

}
