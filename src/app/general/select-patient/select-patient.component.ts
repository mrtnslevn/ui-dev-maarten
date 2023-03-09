import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { Patient } from '../models/Patient';
import { ModalExtraLargeConfig } from 'src/app/_configs/modal-config';
import { ModalSearchPatientComponent } from '../general-modal/modal-search-patient/modal-search-patient.component';
import { SelectPatientFormsService } from './select-patient-forms.service';

@Component({
  selector: 'app-select-patient',
  templateUrl: './select-patient.component.html',
  styleUrls: ['./select-patient.component.scss']
})
export class SelectPatientComponent implements OnInit {

  @Input() set resetDataPatient(value: boolean){
    if(value){
      this.patient = Patient.default()
      if (this.selectPatientForm != undefined) this.selectPatientForm.reset()
    }
  }
  @Input() payment: boolean = false

  private _formRequired: boolean = false
  @Input() set formRequired(value: boolean) {
    this._formRequired = value
    this.selectPatientForm.updateValidatorWhenAdmissionNoChange()
  }

  get formRequired() {
    return this._formRequired
  }

  @Input() set submitted(value: boolean) {
    this.selectPatientForm.submitted = value
  }
  
  @Input() formValid: boolean = false;
  @Output() formValidChange = new EventEmitter<boolean>();

  @Output() getPatientEvent = new EventEmitter<Patient>();
  bsModalRef?: BsModalRef;
  
  @Input() patient: Patient = Patient.defaultWithoutMrNo();
  @Output() patientChange = new EventEmitter<Patient>()

  constructor(private modalService: BsModalService,
    public selectPatientForm: SelectPatientFormsService) 
  {
    this.selectPatientForm.component = this
    this.selectPatientForm.createForm()
  }

  ngOnInit(): void {
  }

  showPatientModal() : void {
    this.bsModalRef = this.modalService.show(ModalSearchPatientComponent, ModalExtraLargeConfig);

    // get event from modal
    this.bsModalRef.content.selectPatientEvent.subscribe((patient: Patient | any) => {
      this.patient = patient

      this.resetDataPatient = false
      this.patientChange.emit(patient)
      this.getPatientEvent.emit(patient)
      
      if (this.payment) {
        this.selectPatientForm.controls["mrNo"].setValue(this.patient.mr_no)
        this.selectPatientForm.controls["dob"].setValue(this.patient.dob)
        this.selectPatientForm.controls["idNo"].setValue(this.patient.id_no)
        this.selectPatientForm.controls["patientName"].setValue(this.patient.patient_name)
        this.formValidChange.emit(this.selectPatientForm.valid)
      }
    })
  }

}
