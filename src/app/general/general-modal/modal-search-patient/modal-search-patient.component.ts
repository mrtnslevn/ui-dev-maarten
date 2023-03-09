import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { Patient } from 'src/app/general/models/Patient';
import { GetPatientListResponse } from 'src/app/general/models/response/GetPatientListResponse';
import { GeneralService } from 'src/app/service/general.service';
import { ModalLargeConfig } from 'src/app/_configs/modal-config';
import { ModalSearchPayerComponent } from '../modal-search-payer/modal-search-payer.component';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { GetListResponse } from '../../models/response/GetListResponse';
import { Sex } from '../../models/Sex';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationFormsService } from './validation-forms.service';
import { Paging } from '../../models/Paging';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { Pagination } from 'src/app/_helpers/pagination';
import { ModalAlertService } from 'src/app/service/modal-alert.service';

@Component({
  selector: 'app-modal-search-patient',
  templateUrl: './modal-search-patient.component.html',
  styleUrls: ['./modal-search-patient.component.scss']
})
export class ModalSearchPatientComponent implements OnInit {

  @Output() selectPatientEvent = new EventEmitter<Patient>();
  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent

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

  params: HttpParams = new HttpParams().set("page_no", 1);
  patientForm!: FormGroup
  submitted = false;
  formErrors: any;

  progress: boolean = false;
  loadPage: boolean = false;
  search = false;

  bsModalShowAlert?: BsModalRef

  constructor(public bsModalRef: BsModalRef, private generalService: GeneralService, 
    private bsModalService : BsModalService,
    private fb: FormBuilder,
    private alertService: ModalAlertService,
    public vf: ValidationFormsService) { 
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
    this.params = this.params.set('patient_name', name);
  }

  onChangeDOB(dob: string){
    this.params = this.params.set('dob', dob);
  }

  onChangeMrNo(mrNo: number){
    if (mrNo > 0) this.params = this.params.set("mr_no", mrNo);
    else this.params = this.params.delete("mr_no");
  }

  onChangeIdNo(idNo: number){
    this.params = this.params.set("id_no", idNo);
  }

  onChangeSex(selected: any) {
    if (selected != null) this.params = this.params.set('sex_id', selected.key);
    else this.params = this.params.delete("sex_id");
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

  openAnotherModal(): void {
    this.bsAnotherModalRef = this.bsModalService.show(ModalSearchPayerComponent, ModalLargeConfig);
  }

  selectPatient(patient: Patient) {
    this.selectPatientEvent.emit(patient);
    this.bsModalRef.hide();
  }

  pageChanged(event: PageChangedEvent): void {
    this.params = this.params.set("page_no", event.page);
    this.getPatientList(event);
  }

}
