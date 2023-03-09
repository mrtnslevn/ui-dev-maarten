import { Component, OnInit, Input } from '@angular/core';
import { RefundDeposit } from '../../models/RefundDeposit';

@Component({
  selector: 'app-card-refund-deposit',
  templateUrl: './card-refund-deposit.component.html',
  styleUrls: ['./card-refund-deposit.component.scss']
})
export class CardRefundDepositComponent implements OnInit {
  @Input() hide:String[] = []
  @Input() refundDepositList:RefundDeposit[] = []
  constructor() { }

  ngOnInit(): void {
  }

}
