import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { DoctorSchedule } from '../../models/DoctorSchedule';

@Component({
  selector: 'app-modal-view-schedule-doctor',
  templateUrl: './modal-view-schedule-doctor.component.html',
  styleUrls: ['./modal-view-schedule-doctor.component.scss']
})
export class ModalViewScheduleDoctorComponent implements OnInit {
  @Input() scheduleData: DoctorSchedule[] = []
  
  constructor(public bsModalRef: BsModalRef,) { }

  ngOnInit(): void {
  }

}
