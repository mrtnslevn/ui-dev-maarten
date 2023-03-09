import {Component, Input, OnInit} from '@angular/core';
import {Voucher} from "../../models/div-card-payment/Voucher";

@Component({
  selector: 'app-div-voucher',
  templateUrl: './div-voucher.component.html',
  styleUrls: ['./div-voucher.component.scss']
})
export class DivVoucherComponent implements OnInit {

  @Input() data: Voucher = {
    voucher_no: '',
    voucher_code: '',
    voucher_name: '',
    voucher_type: '',
    amount: 0,
    notes: '',
  };

  @Input() notes: string = ""
  @Input() readOnly: boolean = false

  newData: Voucher[]=[{
    voucher_no: '',
    voucher_code: '',
    voucher_name: '',
    voucher_type: '',
    amount: 0,
    notes: '',
  }]

  constructor() { }

  ngOnInit(): void {
  }

}
