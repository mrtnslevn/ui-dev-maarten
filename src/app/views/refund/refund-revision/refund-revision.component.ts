import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { Paging } from 'src/app/general/models/Paging';
import { PaymentModeForRefundList } from 'src/app/general/models/PaymentModeForRefundList';
import { RefundRevision } from 'src/app/general/models/RefundRevision';
import { RefundTypeList } from 'src/app/general/models/RefundTypeList';
import { GetApprovalRefundRequestResponse } from 'src/app/general/models/response/GetApprovalRefundRequestResponse';
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { GetRefundRevisionResponse } from 'src/app/general/models/response/GetRefundRevisionResponse';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { RefundService } from 'src/app/service/refund.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { ValidationFormsService } from './validation-forms.service';


@Component({
  selector: 'app-refund-revision',
  templateUrl: './refund-revision.component.html',
  styleUrls: ['./refund-revision.component.scss']
})
export class RefundRevisionComponent implements OnInit {
  loadPage: boolean = false
  progress: boolean = false
  searched: boolean = false
  progressExport: boolean = false
  submitted = false;
  formErrors: any;

  refundTypeList = [
    {key:"deposit-ipd-refund", value: "Refund Deposit IPD"},
    {key:"prepaid-refund", value: "Refund Prepaid"}
  ]
  selectedRefundType = {key: '', value: ''}

  getRefundRevisionResponse!: GetRefundRevisionResponse
  refundRevisionList: RefundRevision[] = []
  param: HttpParams = new HttpParams().set('is_revision', true).set('page_no', 1)

  params: any
  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page?: number
  current_page = 1
  refundRevForm!: FormGroup
  search = false;

  getListResponse: any = {}
  getRefundRevisionList: any = {}
  listRefundType: RefundTypeList[] = []
  defaultRefundType: RefundTypeList = RefundTypeList.deafult()
  defaultPaymentModeList: PaymentModeForRefundList = PaymentModeForRefundList.deafult()
  listPaymentModeList: PaymentModeForRefundList[] = []
  refundApproval_list: any = []

  refundType: string = ""
  mrNo: any
  refundBy: string = ""
  patientName: string = ""
  paymentMode: string = ""
  refundDate: string = ""
  bookingId: any
  returnedBy: string = ""

  constructor(private router: Router, private generalService: GeneralService,
    private alertService: ModalAlertService,
    private fb: FormBuilder,
    public vf: ValidationFormsService,
    private refundService: RefundService) { }

  ngOnInit(): void {
    this.getList();
    this.createForm();
  }

  createForm() {
    this.refundRevForm = this.fb.group({
      name: ['', [Validators.minLength(this.vf.formRules.patientNameMin)]],
      mrNo: ['', [Validators.pattern(this.vf.formRules.numberOnly)]],
      bookingId: ['',[Validators.pattern(this.vf.formRules.numberOnly)]],
      refundType:[this.defaultRefundType, [Validators.required]],
      refundBy: [''],
      returnedBy: [''],
      paymentMode: [this.defaultPaymentModeList],
      refundDate: [''],
    });
  }

  reset() {
    this.refundRevForm.reset();
    this.submitted = false;
  }

  get f() {
    return this.refundRevForm.controls;
  }

  isFormError(formName: string) {
    return this.submitted && this.f[formName].errors;
  }

  isFormValid(formName: string) {
    return { 'is-invalid': this.submitted && this.f[formName].errors, 
              'is-valid': this.submitted && !this.f[formName].errors }
  }

  onValidate() {
    this.submitted = true;
    if(this.refundRevForm.valid){
      this.searchRefundRevisionRequest()
    }
  }

  getErrors(formName: string): any {
    return this.f[formName].errors;
  }

  getErrorMessage(formName: string, error: any): string {
    return this.formErrors[formName][error];
  }

  getList(){
    this.loadPage = true;
    const params = new HttpParams()
    .set('param_list', 'refundTypeList')
    .append('param_list', 'paymentModeForRefundList')

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS) {
            this.listRefundType = this.getListResponse.refundTypeList
            this.listPaymentModeList = this.getListResponse.paymentModeForRefundList
            this.loadPage = false;
        } else {
          this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
          this.loadPage = false;
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
        this.loadPage = false;
      });
  }

  onChangeRefundType(e: RefundTypeList){
    if (e != null){
      this.refundType = e.key
      this.param = this.param.set('refund_type', e.key);
    } 
    else{
      this.refundType = ""
      this.param = this.param.delete("refund_type");
    } 
  }

  onChangeReturnedBy(returnedBy: string){
    if (returnedBy != null){
      this.returnedBy = returnedBy
      this.param = this.param.set('returned_by', returnedBy)
    } 
    else{
      this.returnedBy = ""
      this.param = this.param.delete("returned_by");
    } 

  }

  onChangePatientName(name: string){
    if (name != null){
      this.patientName = name
      this.param = this.param.set('patient_name', name)
    } 
    else{
      this.patientName = ""
      this.param = this.param.delete("patient_name");
    } 
  }

  onChangeMrNo(mrNo: number){
    if (mrNo > 0){
      this.mrNo = mrNo
      this.param = this.param.set("mr_no", mrNo);
    } 
    else{
      this.mrNo = ""
      this.param = this.param.delete("mr_no");
    } 
  }

  onChangeBookingId(bookingId: any){
    if (bookingId != null){
      this.bookingId = bookingId
      this.param = this.param.set('booking_id', bookingId)
    } 
    else{
      this.bookingId = ""
      this.param = this.param.delete('booking_id');
    } 
  }

  onChangeRefundBy(refundBy: any){
    if (refundBy != null){
      this.refundBy = refundBy
      this.param = this.param.set('refund_by', refundBy)
    } 
    else{
      this.refundBy = ""
      this.param = this.param.delete("refund_by");
    } 

  }

  onChangePaymentMode(paymentMode: PaymentModeForRefundList){
    if (paymentMode != null){
      this.paymentMode = paymentMode.key
      this.param = this.param.set('payment_mode', paymentMode.key);
    } 
    else{
      this.paymentMode = ""
      this.param = this.param.delete("payment_mode");
    } 
      
  }

  onChangeRefundDate(date: string){
    if (date != null){
      this.refundDate = date
      this.param = this.param.set('refund_date', date)
    } 
    else{
      this.refundDate = ""
      this.param = this.param.delete('refund_date');
    } 

  }

  searchRefundRevisionRequest(event?: PageChangedEvent){
    this.searched = true
      return this.refundService.getRefundApprovalList(this.param).subscribe((data: GetApprovalRefundRequestResponse)=>{
        this.getRefundRevisionList = {...data};
        if(this.getRefundRevisionList.response_code === RESPONSE_SUCCESS){
          this.refundApproval_list = this.getRefundRevisionList
          PropertyCopier.copyProperties(this.getRefundRevisionList.paging, this.paging);
          this.search = true;
          if (event != undefined) this.page = event.page;
        }
        else {
          this.alertService.showModalAlert(`Failed to get data patient: ${this.getRefundRevisionList.response_desc}`,ALERT_DANGER)
        }
        this.progress = false;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get data refund approval , please contact administration`, ALERT_DANGER)
        this.progress = false;
      });
  }

  navigateToDetailRefundRevision(){}

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.current_page = event.page
  }
  exportRefundRevision(){
    this.progressExport = true;
    const param = new HttpParams()
    .set('refund_type', this.refundType)
    .set('export_file_type', 'excel')

      return this.refundService.exportRefundRevision(param)
      .subscribe((data)=>
      {
        if(data.headers.get("response_code")!="00"){
          this.alertService.showModalAlert(`Failed to export file: ${data.headers.get("response_desc")}`, ALERT_DANGER)  
        }else{
          let blob = data.body as Blob;
          let filename: string = data.headers.get("content-disposition").split(";")[1].split("=")[1].replace(/"/g, '');
          var downloadUrl = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          a.href = downloadUrl;
          a.download = filename;
          a.click();
          
        }
        this.progressExport = false;
      }, err => {
        this.alertService.showModalAlert(`Failed to export invoice, please contact administration`,ALERT_DANGER)
        this.progressExport = false;
      });

  }

  navigateToRefundDepositIpdDetail(){
    this.router.navigate(['/refund/refund-revision-deposit-ipd'])
  }

  navigateToRefundPrepaidDetail(){
    this.router.navigate(['/refund/refund-revision-prepaid'])
  }

}
