import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { DepositIpdService } from 'src/app/service/deposit-ipd.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { formatDate } from '@angular/common';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { GetAdmissionDetailDepositResponse } from '../../models/response/GetAdmissionDetailDepositResponse';
import { GetPatientListResponse } from '../../models/response/GetPatientListResponse';
import { GeneralService } from 'src/app/service/general.service';
import { RefundDepositIpd } from '../../models/RefundDepositIpd';

@Component({
  selector: 'app-card-patient-info-deposit',
  templateUrl: './card-patient-info-deposit.component.html',
  styleUrls: ['./card-patient-info-deposit.component.scss']
})
export class CardPatientInfoDepositComponent implements OnInit {
    @Input() show: boolean = true;
    @Input() ipdHistory: boolean = false;
    @Input() mrNo: any
    @Input() age: any
    @Input() deposit_amount: any
    @Input() data: RefundDepositIpd = RefundDepositIpd.default()

    detailPatient: any = []
    public getAdmissionDetailResponse : GetAdmissionDetailDepositResponse | undefined;
    public getPatientListResponse : GetPatientListResponse | undefined;
    public patient_list : any = [];

  constructor(
    private depositIpdService: DepositIpdService,
    private alertService: ModalAlertService,
    private generalService: GeneralService,) { }

  ngOnInit(): void {
    this.getAdmissionDetail();
  }
  
  getAdmissionDetail(){
    const params = new HttpParams()
    .set("page_no", 1)
    .set('admission_date_to', this.getTodaysDate())
    .set('admission_date_from', this.getYearBeforeDate())
    .set('mr_no', this.mrNo)
    .set('admission_type', "Inpatient")

    return this.depositIpdService.getAdmissionList(params).subscribe((data: GetAdmissionDetailDepositResponse)=>
    {
      this.getAdmissionDetailResponse = {...data};
      if(data.response_code === RESPONSE_SUCCESS){
        this.detailPatient = this.getAdmissionDetailResponse.admission_list[0]
      }else{
        this.alertService.showModalAlert(`Failed to get invoice detail: ${data.response_desc}`,ALERT_DANGER)
      }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get invoice detail, please contact administration`, ALERT_DANGER)
    });

  }

  getTodaysDate() {
    return formatDate(Date.now(), "yyyy-MM-dd", "en-US")
  }
  getYearBeforeDate() {
    const minute = 1000 * 60;
    const hour = minute * 60;
    const day = hour * 24;
    const year = day * 365;
    return formatDate(Date.now()-year, "yyyy-MM-dd", "en-US")
  }

}