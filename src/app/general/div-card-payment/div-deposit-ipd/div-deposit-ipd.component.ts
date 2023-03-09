import {Component, Input, OnInit} from '@angular/core';
import {Deposit_Ipd} from "../../models/div-card-payment/Deposit_Ipd";

@Component({
  selector: 'app-div-deposit-ipd',
  templateUrl: './div-deposit-ipd.component.html',
  styleUrls: ['./div-deposit-ipd.component.scss']
})
export class DivDepositIpdComponent implements OnInit {

  @Input() data: Deposit_Ipd = {
    remaining: 0,
    amount: 0,
  };

  @Input() readOnly: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }

}
