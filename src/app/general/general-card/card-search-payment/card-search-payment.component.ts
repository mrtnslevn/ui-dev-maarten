import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-card-search-payment',
  templateUrl: './card-search-payment.component.html',
  styleUrls: ['./card-search-payment.component.scss']
})
export class CardSearchPaymentComponent implements OnInit {
  listPayment: any = [];
  constructor(private router: Router) { }

  ngOnInit(): void {
  }

  navigateToDetails(): void {
    this.router.navigate(['payment/approval-for-payment-cancellation-detail'])
  }


}
