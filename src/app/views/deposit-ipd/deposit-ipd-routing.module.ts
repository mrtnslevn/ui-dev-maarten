import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { DepositIpdHistoryComponent } from './deposit-ipd-history/deposit-ipd-history.component';
import { DepositIpdListComponent } from './deposit-ipd-list/deposit-ipd-list.component';
import { DepositIpdPaymentDetailComponent } from './deposit-ipd-payment-detail/deposit-ipd-payment-detail.component';
import { DepositIpdPaymentComponent } from './deposit-ipd-payment/deposit-ipd-payment.component';
import { DepositIpdTransactionDetailComponent } from './deposit-ipd-transaction-detail/deposit-ipd-transaction-detail.component';
import { DepositIpdTransactionComponent } from './deposit-ipd-transaction/deposit-ipd-transaction.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Deposit IPD',
    },
    // canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'deposit-ipd-list'
      },
      {
        path: 'deposit-ipd-list',
        component: DepositIpdListComponent,
        data: {
          title: 'Deposit IPD List',
          reuseComponent: false,
        }, 
        children: [
          
        ]
      },
      {
        path: 'deposit-ipd-history/:mr_no/:patient_name',
        component: DepositIpdHistoryComponent,
        data: {
          title: 'Deposit IPD History',
          action: '0421_view_detail'
        }
      },
      {
        path: 'deposit-ipd-payment',
        component: DepositIpdPaymentComponent,
        data: {
          title: 'Deposit IPD Payment'
        },
        children: [
          {
            path:'deposit-payment-detail/:mrNo',
            component: DepositIpdPaymentDetailComponent,
            data: {
              title: 'Deposit Payment IPD'
            }
          },
        ]
      },
      {
        path:'deposit-ipd-list',
        component: DepositIpdListComponent,
        data: {
          title: 'Deposit IPD List'
        }
      },
      {
        path:'deposit-ipd-transaction',
        component: DepositIpdTransactionComponent,
        data: {
          title: 'Deposit IPD Transaction'
        }
      },
      {
        path:'deposit-payment-detail/:mrNo',
        component: DepositIpdPaymentDetailComponent,
        data: {
          title: 'Deposit Payment IPD'
        }
      },
      {
        path: 'deposit-ipd-transaction-detail/:transaction_no/:mr_no/:patient_name/:admission_no',
        component: DepositIpdTransactionDetailComponent,
        data: {
          title: 'Deposit IPD Transaction Detail',
          action: '0431_view_detail'
        } 
      },
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DepositIpdRoutingModule { }
