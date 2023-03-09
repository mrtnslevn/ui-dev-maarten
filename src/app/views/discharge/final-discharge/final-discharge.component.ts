import { Component, OnInit } from '@angular/core';
import { ModalService } from '@coreui/angular';
import { IconSetService } from '@coreui/icons-angular';
import { Patient } from 'src/app/general/models/Patient';

@Component({
  selector: 'app-final-discharge',
  templateUrl: './final-discharge.component.html',
  styleUrls: ['./final-discharge.component.scss'],
})
export class FinalDischargeComponent implements OnInit {

  color = 'primary';
  patient : Patient = Patient.default();

  constructor(private modalService : ModalService) { }

  ngOnInit(): void {
  }

  showModalPatient() : void {
    this.modalService.toggle({show: true, id: "modalpatient"});
  }

  selectPatient(patient: Patient) {
    this.patient = patient;
  }
}
