import { NgModule } from '@angular/core';
import { GeneralModule } from 'src/app/general/general.module';
import { DepositIpdListComponent } from './deposit-ipd-list/deposit-ipd-list.component';
import { DepositIpdRoutingModule } from './deposit-ipd-routing.module';
import { DepositIpdTransactionComponent } from './deposit-ipd-transaction/deposit-ipd-transaction.component';
import { DepositIpdPaymentComponent } from './deposit-ipd-payment/deposit-ipd-payment.component';
import { DepositIpdHistoryComponent } from './deposit-ipd-history/deposit-ipd-history.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { DepositIpdPaymentDetailComponent } from './deposit-ipd-payment-detail/deposit-ipd-payment-detail.component';
import { DepositIpdTransactionDetailComponent } from './deposit-ipd-transaction-detail/deposit-ipd-transaction-detail.component';
import { NgxContextModule } from 'ngx-context';

@NgModule({
  declarations: [
    DepositIpdListComponent,
    DepositIpdTransactionComponent,
    DepositIpdPaymentComponent,
    DepositIpdHistoryComponent,
    DepositIpdPaymentDetailComponent,
    DepositIpdTransactionDetailComponent,
  ],
imports: [
    GeneralModule,
    DepositIpdRoutingModule,
    NgxContextModule,
    PaginationModule,
  ]
})
export class DepositIpdModule { }
