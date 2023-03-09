import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GetAdmissionDetailResponse } from 'src/app/general/models/response/GetAdmissionDetailResponse';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { PaymentService } from 'src/app/service/payment.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';

@Component({
  selector: 'app-discharge-list-detail',
  templateUrl: './discharge-list-detail.component.html',
  styleUrls: ['./discharge-list-detail.component.scss']
})
export class DischargeListDetailComponent implements OnInit {
  loadPage: boolean = false

  getParams: any
  mrNo: number = 0
  admissionNo: string = ''

  getAdmissionDetailResponse!: GetAdmissionDetailResponse
  dischargeDetail: any

  dobArr: string[] = []
  dob:string = ''
  dischargeDateArr: string[] = []
  dischargeDate: string = ''
  admissionDateArr: string[] = []
  admissionDate: string = ''

  constructor(
    private route: ActivatedRoute,
    private paymentService: PaymentService,
    private alertService: ModalAlertService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getParams = this.route.params.subscribe(params => {
      this.mrNo = params['mrNo'];
      this.admissionNo = params['admissionNo']
    })

    this.getAdmissionDetail()
  }

  getAdmissionDetail(){
    this.loadPage = true
    const params = new HttpParams()
      .set('admission_no', this.admissionNo)
      .set('mr_no', this.mrNo);

    return this.paymentService.getAdmissionDetail(params)
      .subscribe((data) => {
        this.getAdmissionDetailResponse = {...data};
        if (this.getAdmissionDetailResponse.response_code === RESPONSE_SUCCESS) {
          this.editDate()
        }else{
          this.alertService.showModalAlert(`Failed to get admisssion detail: ${this.getAdmissionDetailResponse.response_desc}`,ALERT_DANGER)
        }
        this.loadPage = false
      }, err => {
        this.loadPage = false
        this.alertService.showModalAlert(`An error has occured while get admisiion detail, please contact administration`, ALERT_DANGER)
      });
  }

  editDate(){
    this.dobArr = this.getAdmissionDetailResponse.dob.split('T')
    this.dob = this.dobArr[0]

    this.admissionDateArr = this.getAdmissionDetailResponse.admission_date.split('T')
    this.admissionDate = this.admissionDateArr[0]

    this.dischargeDateArr = this.getAdmissionDetailResponse.discharge_date.split('T')
    this.dischargeDate = this.dischargeDateArr[0]
  }

  navigateToPayment(){
    this.router.navigate(['payment/payment', this.admissionNo])
  }
}
