import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Paging } from 'src/app/general/models/Paging';
import { RefundDepositIpd } from 'src/app/general/models/RefundDepositIpd';
import { RefundPrepaid } from 'src/app/general/models/RefundPrepaid';
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { GetRefundDepositIpdResponse } from 'src/app/general/models/response/GetRefundDepositIpdResponse';
import { GetRefundPrepaidResponse } from 'src/app/general/models/response/GetRefundPrepaidResponse';
import { Sex } from 'src/app/general/models/Sex';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { PaymentService } from 'src/app/service/payment.service';
import { PrepaidService } from 'src/app/service/prepaid.service';
import { ALERT_DANGER, DEPOSITIPD, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { RequestRefundFormsService } from './request-refund-forms.service';
import { RequestRefundPrepaidFormsService } from './request-refund-prepaid-forms.service';

@Component({
  selector: 'app-request-refund',
  templateUrl: './request-refund.component.html',
  styleUrls: ['./request-refund.component.scss']
})
export class RequestRefundComponent implements OnInit {

  loadPage: boolean = false
  progress: boolean = false
  progressExport: boolean = false
  depositSearched: boolean = false
  prepaidSearched: boolean = false

  refundTypeList = [
    {key:"deposit-ipd-refund", value: "Refund Deposit IPD"},
    {key:"prepaid-refund", value: "Refund Prepaid"}
  ]
  selectedRefundType = {key: '', value: ''}
  genderList: Sex[] = []
  selectedGender = {key: '', value: ''}

  patientName: string = ''
  mrNo: number = 0
  dob: string = ''
  idNo: number = 0
  bookingId: string = ''

  getListResponse!: GetListResponse
  getRefundPrepaidResponse!: GetRefundPrepaidResponse
  refundPrepaidList: RefundPrepaid[] = []
  getRefundDepositIpdResponse!: GetRefundDepositIpdResponse
  refundDepositList: RefundDepositIpd[] = []

  paramsDeposit = new HttpParams().set('page_no',1)
  paramsPrepaid = new HttpParams().set('page_no',1)
  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page?: number
  current_page = 1

  constructor(private router: Router,
    private generalService: GeneralService,
    private alertService: ModalAlertService,
    private paymentService: PaymentService,
    private prepaidService: PrepaidService,
    public fs: RequestRefundFormsService,
    public fsp: RequestRefundPrepaidFormsService) {
      this.fs.component = this
      this.fsp.component = this
      this.fs.createForm()
      this.fsp.createForm()
    }
    
  ngOnInit(): void {
    this.getList()
  }

  getList(){
    this.loadPage = true
    const params = new HttpParams()
    .set('param_list', 'genderList')

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.genderList = this.getListResponse.genderList
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
    // get search params and search invoice list
    // if (history.state.fromDetail) {
    //   let params: string = window.sessionStorage.getItem(DischargeListSearchParam.PARAM_KEY)!
    //   let searchParams: DischargeListSearchParam = JSON.parse(params)

    //   let lob = this.listLob.find(l => l.key == searchParams.lob.key)

    //   this.onChangeLob(lob)
    //   this.onChangeAdmissionNo(searchParams.admission_no)
    //   this.onChangeFromDate(searchParams.discharge_date_from)
    //   this.onChangeToDate(searchParams.discharge_date_to)
    //   this.onChangeMrNo(searchParams.mr_no);
    //   this.onChangePatientName(searchParams.patient_name);

    //   this.pageChanged({page: searchParams.page_no, itemsPerPage: 0})

    //   this.fs.controls['lob'].setValue(lob)
    //   this.fs.controls['mrNo'].setValue(searchParams.mr_no)
    // } else {
    //   window.sessionStorage.removeItem(DischargeListSearchParam.PARAM_KEY)
    // }
  }

  onChangeRefundType(e: any){
    this.selectedRefundType = e
    this.depositSearched = false
    this.prepaidSearched = false
  }

  searchRefundDepositIPD(){
    this.depositSearched = true
    this.prepaidSearched = false
  }

  searchRefundPrepaid(){
    this.prepaidSearched = true
    this.depositSearched = false
  }
  
  onChangePatientName(e: any, type: string){
    this.patientName = e
    if(type==DEPOSITIPD){
      this.paramsDeposit = this.paramsDeposit.set('patient_name',this.patientName)
    }else{
      this.paramsPrepaid = this.paramsPrepaid.set('patient_name',this.patientName)
    }
  }
  
  onChangeMrNo(e: any, type: string){
    this.mrNo = e
    if(type==DEPOSITIPD){
      this.paramsDeposit = this.paramsDeposit.set('mr_no',this.mrNo)
    }else{
      this.paramsPrepaid = this.paramsPrepaid.set('mr_no',this.mrNo)
    }
  }
  
  onChangeDob(e: any, type: string){
    this.dob = e
    if(type==DEPOSITIPD){
      this.paramsDeposit = this.paramsDeposit.set('dob',this.dob)
    }else{
      this.paramsPrepaid = this.paramsPrepaid.set('dob',this.dob)
    }
  }
  
  onChangeIdNo(idNo: any){
    this.idNo = idNo
    this.paramsDeposit = this.paramsDeposit.set("id_no", idNo);
  }
  
  onChangeGender(e: any){
    this.selectedGender = e
    this.paramsDeposit = this.paramsDeposit.set('sex_id',this.selectedGender.key)
  }
  
  onChangeBookingId(e: any){
    this.bookingId = e
    this.paramsDeposit = this.paramsDeposit.set('booking_id',this.bookingId)
  }
  onReset(){
    this.fs.reset()
    this.fsp.reset()
    this.fs.submitted = false
    this.fsp.submitted = false
    this.paramsDeposit = new HttpParams().set('page_no',1)
    this.paramsPrepaid = new HttpParams().set('page_no',1)
  }

  onValidatePrepaid(){
    this.fsp.submitted = true
    if (this.fsp.valid) this.searchPrepaidList();
  }
  
  onValidateRefundDeposit(){
    this.fs.submitted = true
    if (this.fs.valid) this.searchDepositIpdList();
  }
  
  searchDepositIpdList(){
    this.searchRefundDepositIPD()
    this.progress = true
    return this.paymentService.getPatientInfo(this.paramsDeposit).subscribe((data: GetRefundDepositIpdResponse) => {
      this.getRefundDepositIpdResponse = {...data}
      if(this.getRefundDepositIpdResponse.response_code === RESPONSE_SUCCESS){
        this.refundDepositList = this.getRefundDepositIpdResponse.patient_list
      }else{
        this.alertService.showModalAlert(`Failed to get admisssion detail: ${this.getRefundDepositIpdResponse.response_desc}`,ALERT_DANGER)
      }
      this.progress = false
    }, err => {
      this.progress = false
      this.alertService.showModalAlert(`An error has occured while get refund deposit ipd list, please contact administration`, ALERT_DANGER)
    })
  }
  
  searchPrepaidList(){
    this.searchRefundPrepaid()
    this.paramsPrepaid = this.paramsPrepaid.set('status','Settled')
    
    return this.prepaidService.getAll(this.paramsPrepaid).subscribe(data => {
      this.getRefundPrepaidResponse = {...data}
      if(this.getRefundPrepaidResponse.response_code === RESPONSE_SUCCESS){
        this.refundPrepaidList = this.getRefundPrepaidResponse.prepaid_list
      }else{
        this.alertService.showModalAlert(`Failed to get admisssion detail: ${this.getRefundPrepaidResponse.response_desc}`,ALERT_DANGER)
      }
    },err => {
      this.alertService.showModalAlert(`An error has occured while get refund prepaid list, please contact administration`, ALERT_DANGER)
    })
  }

  navigateToDetailRefundPrepaid(){}

  exportRefundPrepaidList(){}

  pageChanged(event: PageChangedEvent) {
    // this.params = this.params.set("page_no", event.page);
    // this.current_page = event.page
  }

  navigateToRefundDepositIpdDetail(data: RefundDepositIpd){
    window.sessionStorage.setItem(RefundDepositIpd.PARAM_KEY, JSON.stringify(data));
    this.router.navigate(['/refund/refund-deposit-detail'])
  }

  navigateToRefundPrepaidDetail(data: RefundPrepaid){
    window.sessionStorage.setItem(RefundPrepaid.PARAM_KEY, JSON.stringify(data));
    this.router.navigate(['/refund/refund-prepaid-detail'])
  }

}
