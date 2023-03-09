import { Component, Input, OnInit } from '@angular/core';
import { RefundPrepaid } from '../../models/RefundPrepaid';

@Component({
  selector: 'app-card-patient-info-prepaid',
  templateUrl: './card-patient-info-prepaid.component.html',
  styleUrls: ['./card-patient-info-prepaid.component.scss']
})
export class CardPatientInfoPrepaidComponent implements OnInit {
  @Input() show: boolean = true;
  @Input() data: RefundPrepaid = RefundPrepaid.deafult()

  constructor() { }

  ngOnInit(): void {
  }

}