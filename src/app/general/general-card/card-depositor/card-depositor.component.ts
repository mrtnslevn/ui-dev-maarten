import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DepositIpdService } from 'src/app/service/deposit-ipd.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { ComboBox } from '../../models/ComboBox';
import { NationalityType } from '../../models/NationalityType';
// import { PaymentModeListForDeposit } from '../../models/PaymentModeListForDeposit';
import { RelationshipWithPatient } from '../../models/RelationshipWithPatient';
import { GetDepositorInfoResponse } from '../../models/response/GetDepositorInfoResponse';
import { GetListResponse } from '../../models/response/GetListResponse';
import { Sex } from '../../models/Sex';
import { formatDate } from '@angular/common';
import { Patient } from '../../models/Patient';
import { Depositor } from '../../models/Depositor';
import { PropertyCopier } from 'src/app/_helpers/property-copier';


@Component({
  selector: 'app-card-depositor',
  templateUrl: './card-depositor.component.html',
  styleUrls: ['./card-depositor.component.scss']
})
export class CardDepositorComponent implements OnInit {

  @Input() readOnly: boolean = false;
  @Input() patientInfoRepo: Patient = Patient.default()
  depositorForm!: FormGroup;
  isChecked: boolean = false;
  isReadonly = false;

  defaultSex: Sex = { key: "", value: "All" };
  listSex: ComboBox[] = [this.defaultSex]
  defaultNationalityType: NationalityType = { key: "", value: "All" }
  defaultRelation: RelationshipWithPatient = { key: "1", value: "Patient" };
  listNationalityType: ComboBox[] = []
  listRelationship: ComboBox[] = []
  listPayment: ComboBox[] = []
  
  name: string = ""
  dob: string = ""
  address: string = ""
  email: string = ""
  phone: string = ""
  relation: number = 0
  file: string = ""

  getListResponse: any = {}
  public getDepositorInfo: GetDepositorInfoResponse | undefined;
  public depositorInfoList: any = []

  params: HttpParams = new HttpParams()
  loadPage: boolean = true;
  @Input() depositor: Depositor = Depositor.default()
  @Output() depositorChange = new EventEmitter<Depositor>();

  constructor(private fb: FormBuilder,
    private alertService: ModalAlertService,
    private depositIpdService: DepositIpdService) {
      this.createForm();
    }

  ngOnInit(): void {
    this.isChecked = false;
    this.getList();
    console.log(this.patientInfoRepo)
  }

  createForm() {
    this.depositorForm = this.fb.group({
      identityType: ['', [Validators.required]],
      identityNo: ['', [Validators.required]],
      depositorName: ['', [Validators.required]],
      depositorDob: ['', [Validators.required]],
      depositorAddress: ['', [Validators.required]],
      depositorEmail: ['', [Validators.required]],
      depositorPhone: ['', [Validators.required]],
      depositorRelation: ['1', [Validators.required]],
      depositorFile: ['', [Validators.required]],
    })
  }

  onChangeSameWithPatient(event: any){

    if(event.target.checked == false){
      this.isReadonly = false;
    }else{
      this.isReadonly = true;
      this.getChangeSameWithPatient();
    }
  }

  getList() {
    this.loadPage = true;
    const params = new HttpParams()
    .set('param_list', 'genderList')
    .append('param_list', 'nationalityIdTypeList')
    .append('param_list', 'relationshipWithPatientIdList')

    this.depositIpdService.getList(params)
    .subscribe((data: GetListResponse) => {
      this.getListResponse = {...data};
      if (this.getListResponse.response_code == RESPONSE_SUCCESS) {
        this.getListResponse.genderList.forEach((g: Sex) => {
          this.listSex.push(g)
          this.loadPage = false;
        });
        this.getListResponse.nationalityIdTypeList.forEach((g: NationalityType) => {
          this.listNationalityType.push(g)

        });
        this.getListResponse.relationshipWithPatientList.forEach((g: RelationshipWithPatient) => {
          this.listRelationship.push(g)

        });
        // this.getListResponse.paymentModeListForDepositIpd.forEach((g: PaymentModeListForDeposit) => {
        //   this.listPayment.push(g)

        // });
      } else {
        this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadPage = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
      this.loadPage = false;
    })
  }

  get f() {
    return this.depositorForm.controls;
  }

  getChangeSameWithPatient(){
    // console.log(this.patientInfoRepo[0])
    this.f['depositorName'].setValue(this.patientInfoRepo.patient_name)
    this.f['depositorDob'].setValue(formatDate(this.patientInfoRepo.dob!, "yyyy-MM-dd", "en-US"))
    this.f['depositorAddress'].setValue(this.patientInfoRepo.address)
    this.f['depositorEmail'].setValue(this.patientInfoRepo.email)
    this.f['depositorPhone'].setValue(this.patientInfoRepo.phone_no)
    this.f['depositorRelation'].setValue("1");

    PropertyCopier.copyProperties(this.patientInfoRepo, this.depositor)
    this.depositor.dob = formatDate(this.patientInfoRepo.dob!, "yyyy-MM-dd", "en-US")
    this.depositor.name = this.patientInfoRepo.patient_name!
    this.depositor.is_patient = true;
    console.log(this.depositor)
    this.depositorChange.emit(this.depositor)
  }

  getIdentityInfo(){

    return this.depositIpdService.getDepositorInfo(this.params).subscribe((data:GetDepositorInfoResponse) => {
      this.getDepositorInfo = {...data};
      if(this.getDepositorInfo.response_code == RESPONSE_SUCCESS){
        this.depositorInfoList = this.getDepositorInfo
        this.f['depositorName'].setValue(this.depositorInfoList.name)
        this.f['depositorDob'].setValue(formatDate(this.depositorInfoList.dob, "yyyy-MM-dd", "en-US"))
        this.f['depositorAddress'].setValue(this.depositorInfoList.address)
        this.f['depositorEmail'].setValue(this.depositorInfoList.email)
        this.f['depositorPhone'].setValue(this.depositorInfoList.phone_no)
        if(this.depositorInfoList.identity_file_path != null && this.depositorInfoList.identity_file_path != ''){
          this.f['depositorFile'].removeValidators([Validators.required]);
        }
        // this.f['depositorFile'].setValue(this.depositorInfoList.identity_file_path)
        
        PropertyCopier.copyProperties(this.getDepositorInfo, this.depositor);
        this.depositorChange.emit(this.depositor)
      }else{
        this.alertService.showModalAlert(`Failed to get invoice detail: ${data.response_desc}`,ALERT_DANGER)
      }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get invoice detail, please contact administration`, ALERT_DANGER)
    });
  }

  onChangeIdentityType(selected: any){
     if (selected != null) this.params = this.params.set('national_id_type_id', selected.key);
     else this.params = this.params.delete("national_id_type_id");
  }

  onChangeIdentityNo(identityNo: number){
    // this.params = this.params.set('national_type_id', '1')
    this.params = this.params.set("national_id_no", identityNo)
  }

  onChangeName(name: string){
    this.name = name
  }

  onChangeDob(dob: string){
    this.dob = dob
  }
  onChangeAddress(address: string){
    this.address = address
  }

  onChangeEmail(email: string){
    this.email = email
  }

  onChangePhone(phone: string){
    this.phone = phone
  }

  onChangeRelation(selected: any){
    this.relation = selected.key
  }

  onChangeFile(event: any){
    let file = event.target.files[0]
    const reader = new FileReader();
    reader.readAsDataURL(file)
    reader.onload = () => {
      this.file = reader.result?.toString()!
      this.depositor.identity_filestr = this.file
      this.depositorChange.emit(this.depositor)
    }
  }

}
