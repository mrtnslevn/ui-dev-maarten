import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { Patient } from 'src/app/general/models/Patient';
import { GetPatientListResponse } from 'src/app/general/models/response/GetPatientListResponse';
import { GeneralService } from 'src/app/service/general.service';
import { ModalLargeConfig } from 'src/app/_configs/modal-config';
import { ModalSearchPayerComponent } from 'src/app/general/general-modal/modal-search-payer/modal-search-payer.component';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { Sex } from 'src/app/general/models/Sex';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationFormsService } from './validation-forms.service';
import { Paging } from 'src/app/general/models/Paging';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { Router, NavigationExtras } from '@angular/router';
import { DepositIpdPaymentSearchParam } from 'src/app/general/models/search-param/DepositIpdPaymentSearchParam';


@Component({
  selector: 'app-deposit-ipd-payment',
  templateUrl: './deposit-ipd-payment.component.html',
  styleUrls: ['./deposit-ipd-payment.component.scss'],
})
export class DepositIpdPaymentComponent implements OnInit {

    @Output() selectPatientEvent = new EventEmitter<Patient>();
    @ViewChild(PaginationComponent) paginationComp!: PaginationComponent
    private _data: Patient = Patient.default()
    @Input() set data(value: Patient) {
    this._data = value
  }
  
    public getPatientListResponse : GetPatientListResponse | undefined;
    public patient_list : any = [];
    public visible = false;
    public total_row : number = 0;
  
    title?: string;
    closeBtnName?: string;
    list: any[] = [];
    
    current_page = 1;
    page?: number;
    paging: Paging = new Paging(0, 0, 0, 0, 0);
  
    bsAnotherModalRef?: BsModalRef;
  
    getListResponse: any = {}
    defaultSex: Sex = { key: "", value: "All" };
    listSex: Sex[] = [this.defaultSex]
    selectedSex: Sex = this.defaultSex
  
    params: HttpParams = new HttpParams().set("page_no", 1);
    patientForm!: FormGroup
    submitted = false;
    formErrors: any;
  
    progress: boolean = false;
    loadPage: boolean = false;
    search = false;

    patientName: string = ""
    idNo: number = 0
    dob: string = ""
    mrNo: any = ""
  
    bsModalShowAlert?: BsModalRef
  
    constructor(public bsModalRef: BsModalRef, private generalService: GeneralService, 
      private bsModalService : BsModalService,
      private fb: FormBuilder,
      private alertService: ModalAlertService,
      public vf: ValidationFormsService, private router: Router) {
        this.formErrors = this.vf.errorMessages;
        this.createForm();
      }
  
    ngOnInit(): void {
      this.getList()
    }
  
    createForm() {
      this.patientForm = this.fb.group({
        name: ['', [Validators.required, Validators.minLength(this.vf.formRules.patientNameMin),] ],
        dob: ['', [Validators.required]],
        mrNo: ['', [Validators.pattern(this.vf.formRules.numberOnly)]],
        idNo: [''],
        selectedSex:[this.defaultSex],
      });
    }
  
    reset() {
      this.patientForm.reset();
      this.submitted = false;
    }
  
    get f() {
      return this.patientForm.controls;
    }
  
    isFormError(formName: string) {
      return this.submitted && this.f[formName].errors;
    }
  
    isFormValid(formName: string) {
      return { 'is-invalid': this.submitted && this.f[formName].errors, 
                'is-valid': this.submitted && !this.f[formName].errors }
    }
  
    isMrNoValid(formName: string) {
      return { 'is-invalid': this.submitted && this.f[formName].errors, 
                'is-valid': this.f[formName].value != null && this.f[formName].value != "" && this.submitted && !this.f[formName].errors }
    }
  
    onValidate() {
      this.submitted = true;
      if(this.patientForm.valid){
        this.searchPatient()
      }
    }
  
    getErrors(formName: string): any {
      return this.f[formName].errors;
    }
  
    getErrorMessage(formName: string, error: any): string {
      return this.formErrors[formName][error];
    }
  
    onChangePatientName(name: string){
      this.patientName = name;
      this.params = this.params.set('patient_name', name);
    }
  
    onChangeDOB(dob: string){
      this.dob = dob;
      this.params = this.params.set('dob', dob);
    }
  
    onChangeMrNo(mrNo: number){
      if (mrNo > 0){
        this.mrNo = mrNo
        this.params = this.params.set("mr_no", mrNo);
      } 
      else{
        this.mrNo = ""
        this.params = this.params.delete("mr_no");
      } 
    }
  
    onChangeIdNo(idNo: number){
      this.idNo = idNo;
      this.params = this.params.set("id_no", idNo);
    }
  
    onChangeSex(selected: any) {
      if (selected != null){
        this.selectedSex = selected
        this.params = this.params.set('sex_id', selected.key);
      } 
      else{
        this.selectedSex = this.defaultSex
        this.params = this.params.delete("sex_id");
      } 
    }
  
    getList(){
      this.loadPage = true;
      const params = new HttpParams()
      .set('param_list', 'genderList');
  
      return this.generalService.getListWithParam(params)
        .subscribe((data: GetListResponse)=>
        {
          this.getListResponse = {...data};
          if(this.getListResponse.response_code === RESPONSE_SUCCESS) {
            this.getListResponse.genderList.forEach((g: Sex) => {
              this.listSex.push(g)
              this.loadPage = false;
            });
            this.getSearchParams()
          } else {
            this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
            this.loadPage = false;
          }
        }, err => {
          this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
          this.loadPage = false;
        });
    }
  
    searchPatient() {
      this.paging = new Paging(0, 0, 0, 0, 0)
      this.pageChanged({page: 1, itemsPerPage: 0})
    }
  
    getPatientList(event?: PageChangedEvent) {
      this.saveSearchParams()
      this.progress = true;
      return this.generalService.getPatientList(this.params)
        .subscribe((data: GetPatientListResponse) => {
          this.getPatientListResponse = {...data};
          if(this.getPatientListResponse.response_code === RESPONSE_SUCCESS) {
            this.patient_list = this.getPatientListResponse.patient_list;
            PropertyCopier.copyProperties(this.getPatientListResponse.paging, this.paging);
            this.search = true;
            if (event != undefined) this.page = event.page;
          } else {
            this.alertService.showModalAlert(`Failed to get data patient: ${this.getPatientListResponse.response_desc}`,ALERT_DANGER)
          }
          this.progress = false;
        }, err => {
          this.alertService.showModalAlert(`An error has occured while get data patient , please contact administration`, ALERT_DANGER)
          this.progress = false;
        });
    }
  
    selectPatient(patient: Patient): void {
      let searchBody: DepositIpdPaymentSearchParam = {
        patient_name: this.patientName,
        dob: this.dob,
        page_no: this.current_page,
        id_no: this.idNo,
        sex: this.selectedSex,
        mr_no: this.mrNo,
        age: patient.age,
        address: patient.address,
        phone_no: patient.contact_no,
        email: patient.email,
        deposit_amount: patient.deposit_amount,
      }
      // this.saveSearchParams()
      window.sessionStorage.setItem(DepositIpdPaymentSearchParam.PARAM_KEY, JSON.stringify(searchBody));
      this.router.navigate(['deposit-ipd/deposit-payment-detail', patient.mr_no]);
      // this.selectPatientEvent.emit(patient);
      this.search = false;

    }
  
    pageChanged(event: PageChangedEvent): void {
      this.params = this.params.set("page_no", event.page);
      this.getPatientList(event);
    }

    getSearchParams() {
      if (history.state.fromDetail) {
        let params: string = window.sessionStorage.getItem(DepositIpdPaymentSearchParam.PARAM_KEY)!
        let searchParams: DepositIpdPaymentSearchParam = JSON.parse(params)
        
        this.onChangeDOB(searchParams.dob);
        this.onChangeIdNo(searchParams.id_no);
        this.onChangeMrNo(searchParams.mr_no);
        this.onChangeSex(searchParams.sex);
        this.onChangePatientName(searchParams.patient_name);
        this.f['name'].setValue(searchParams.patient_name);
        this.f['dob'].setValue(searchParams.dob);
        // this.f['mrNo'].setValue(searchParams.mr_no);
        // this.f['idNo'].setValue(searchParams.id_no);
        // this.f['name'].setValue(searchParams.sex);
  
        this.pageChanged({page: searchParams.page_no, itemsPerPage: 0})

      } else {
        window.sessionStorage.removeItem(DepositIpdPaymentSearchParam.PARAM_KEY)
      }
    }

    saveSearchParams() {
      // let searchBody: DepositIpdPaymentSearchParam = {
      //   patient_name: this.patientName,
      //   dob: this.dob,
      //   page_no: this.current_page,
      //   id_no: this.idNo,
      //   sex: this.selectedSex,
      //   mr_no: this.mrNo,
      // }
      // window.sessionStorage.setItem(DepositIpdPaymentSearchParam.PARAM_KEY, JSON.stringify(searchBody));
    }
}
