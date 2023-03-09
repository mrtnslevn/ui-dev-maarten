import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {Patient} from "../../models/Patient";
import {ModalExtraLargeConfig} from "../../../_configs/modal-config";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {ModalSearchPayerComponent} from "../../general-modal/modal-search-payer/modal-search-payer.component";
import { GeneralService } from 'src/app/service/general.service';
import { HttpParams } from '@angular/common/http';
import { GetListResponse } from '../../models/response/GetListResponse';
import { RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { ComboBox } from '../../models/ComboBox';

@Component({
  selector: 'app-card-patient-info',
  templateUrl: './card-patient-info.component.html',
  styleUrls: ['./card-patient-info.component.scss']
})
export class CardPatientInfoComponent implements OnInit {

  @Input() loadPage: boolean = false;
  @Input() show: boolean = true;
  
  private _data: Patient = Patient.default()
  @Input() set data(value: Patient) {
    this._data = value

    let patientType: ComboBox | undefined = this.listPatientType.find(p => Number(p.key) == this._data.patient_type_id)
    if (patientType != undefined && patientType != null) {
      this.selectedPatientType = patientType
      if (Number(patientType.key) == 2) {
        this.enablePayer()
      } else {
        this.disablePayer()
      }
    } else {
      this.selectedPatientType = this.defaultPatientType
      this.disablePayer()
    }
  }

  get data(): Patient {
    return this._data
  }
  @Output() dataChange = new EventEmitter<Patient>()

  @Input() payerChanged: boolean = false
  @Output() payerChangedChange = new EventEmitter<boolean>()

  @Input() payment: boolean = false
  @Input() searchPayer: boolean = false;

  @Input() patientTypePayer: boolean = false
  @Output() patientTypePayerChange = new EventEmitter<boolean>()

  bsModalRef?: BsModalRef

  getListResponse!: GetListResponse

  listPatientType: ComboBox[] = []
  selectedPatientType: ComboBox = ComboBox.default()
  defaultPatientType: ComboBox = ComboBox.default()

  disableSearchPayer: boolean = true
  disablePayerIdNo: boolean = true
  disableEligibilityNo: boolean = true

  constructor(public bsModalService: BsModalService,
    private generalService: GeneralService) { }

  ngOnInit(): void {
    this.getList();
  }

  getList() {
    this.loadPage = true

    const params = new HttpParams().set("param_list", "patientTypeList");
    this.generalService.getListWithParam(params).subscribe((data: GetListResponse) => {
      this.getListResponse = {...data}
      if (this.getListResponse.response_code == RESPONSE_SUCCESS) {
        this.listPatientType = this.getListResponse.patientTypeList
      }

      this.loadPage = false
    }, err => {
      this.loadPage = false
    })
  }

  checkPatientInfoSelected(list: ComboBox): boolean {
    return Number(list.key) === this.data.patient_type_id
  }

  onChangePatientType(patientType: ComboBox) {
    this.data.patient_type_id = Number(patientType.key)
    this.data.patient_type = patientType.value

    if (this.data.patient_type_id == 2) {
      this.disableSearchPayer = false
      this.disablePayerIdNo = false
      this.disableEligibilityNo = false
      this.patientTypePayerChange.emit(true)
    } else {
      this.data.payer_id = 0;
      this.data.payer_name = '';
      this.data.payer_id_no = '';
      this.data.eligibility_no = '';
      this.disableSearchPayer = true
      this.disablePayerIdNo = true
      this.disableEligibilityNo = true
      this.patientTypePayerChange.emit(false)
    }

    this.payerChangedChange.emit(true)
  }

  onChangeNotes(notes: string){
    this.data.notes = notes
    this.dataChange.emit(this.data)
  }

  disablePayer() {
    this.disableSearchPayer = true
    this.disablePayerIdNo = true
    this.disableEligibilityNo = true
  }

  enablePayer() {
    this.disableSearchPayer = false
    this.disablePayerIdNo = false
    this.disableEligibilityNo = false
  }

  openModalSearchPayer(){
    this.bsModalRef = this.bsModalService.show(ModalSearchPayerComponent, ModalExtraLargeConfig);
    // get event from modal
    this.bsModalRef.content.newItemEvent.subscribe((patient: Patient | any) => {
      this.data.payer_id = patient.payer_id;
      this.data.payer_name = patient.payer_name;
      this.payerChangedChange.emit(true)
    })
  }

  onChangePayerIdNo(payerIdNo: any) {
    this.data.payer_id_no = payerIdNo
    this.dataChange.emit(this.data)
    this.payerChangedChange.emit(true)
  }

  onChangeEligibilityNo(eligibilityNo: any) {
    this.data.eligibility_no = eligibilityNo
    this.dataChange.emit(this.data)
    this.payerChangedChange.emit(true)
  }

}
