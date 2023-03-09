import { Component, OnInit, Input } from '@angular/core';
import { DepositPrepaidHistory } from 'src/app/views/prepaid/models/deposit-prepaid-history.model';

@Component({
  selector: 'app-card-deposit-prepaid-history',
  templateUrl: './card-deposit-prepaid-history.component.html',
  styleUrls: ['./card-deposit-prepaid-history.component.scss']
})
export class CardDepositPrepaidHistoryComponent implements OnInit {
  @Input() depositHistoryList: DepositPrepaidHistory[] = []
  @Input() hide: string[] = []

  constructor() {

  }

  ngOnInit(): void {
  }
}
