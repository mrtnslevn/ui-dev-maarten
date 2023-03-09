import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-card-refund-deposit-approval-detail',
  templateUrl: './card-refund-deposit-approval-detail.component.html',
  styleUrls: ['./card-refund-deposit-approval-detail.component.scss']
})
export class CardRefundDepositApprovalDetailComponent implements OnInit {
    @Input() show: boolean = true;

  constructor() { }

  ngOnInit(): void {
  }

}