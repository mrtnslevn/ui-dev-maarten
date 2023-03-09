import {Component, Input, OnInit} from '@angular/core';
import {Qris} from "../../models/div-card-payment/Qris";

@Component({
  selector: 'app-div-qris',
  templateUrl: './div-qris.component.html',
  styleUrls: ['./div-qris.component.scss']
})
export class DivQrisComponent implements OnInit {

  @Input() data: Qris = {
    settlement_no: '',
    qris: '',
    transaction_id: '',
    customer_name: '',
    phone_no: '',
    issuer: '',
    payment_date: '',
    approval_code: '',
    notes: '',
  };

  @Input() readOnly: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
