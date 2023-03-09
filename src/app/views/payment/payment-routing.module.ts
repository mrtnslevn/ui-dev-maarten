import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApprovalInvoiceCancellationComponent } from './approval-invoice-cancellation/approval-invoice-cancellation.component';
import { ApprovalPaymentCancellationComponent } from './approval-payment-cancellation/approval-payment-cancellation.component';
import { InvoiceCancellationDetailComponent } from './invoice-cancellation-detail/invoice-cancellation-detail.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { PaymentCancellationDetailComponent } from './payment-cancellation-detail/payment-cancellation-detail.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { PaymentComponent } from './payment/payment.component';
import { InvoiceListDetailComponent } from "./invoice-list-detail/invoice-list-detail.component";
import { PaymentListDetailComponent } from "./payment-list-detail/payment-list-detail.component";
import { AuthGuard } from 'src/app/guards/auth.guard';
import { EdcTestComponent } from './edc-test/edc-test.component';


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Payment'
    },
    canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'payment',
      },
      {
        path: 'payment',
        component: PaymentComponent,
        data: {
          title: 'Payment',
          reuseComponent: false,
        }
      },
      {
        path: 'invoice-list',
        component: InvoiceListComponent,
        data: {
          title: 'Invoice List',
          reuseComponent: false
        },
        children: [
          {
            path: 'invoice-list-detail/:invoiceNo',
            component: InvoiceListDetailComponent,
            data: {
              title: 'Invoice List Detail',
              action: "0222_view_detail"
            }
          },
        ]
      },
      {
        path: 'invoice-list-detail/:invoiceNo',
        component: InvoiceListDetailComponent,
        data: {
          title: 'Invoice List Detail',
          action: "0222_view_detail"
        }
      },
      {
        path: 'payment-list',
        component: PaymentListComponent,
        data: {
          title: 'Payment List',
          reuseComponent: false
        }
      },
      {
        path: 'payment-list-detail/:settlementNo/:invoiceNo',
        component: PaymentListDetailComponent,
        data: {
          title: 'Payment List Detail',
          action: "0232_view_detail"
        }
      },
      {
        path: 'approval-for-invoice-cancellation',
        component: ApprovalInvoiceCancellationComponent,
        data: {
          title: 'Approval for Invoice Cancellation',
          reuseComponent: false
        },
      },
      {
        path: 'approval-for-payment-cancellation',
        component: ApprovalPaymentCancellationComponent,
        data: {
          title: 'Approval for Payment Cancellation',
          reuseComponent: false
        }
      },
      {
        path: 'approval-for-payment-cancellation-detail/:paymentCancellationId/:invoiceNo/:settlementNo',
        component: PaymentCancellationDetailComponent,
        data: {
          title: 'Approval for Payment Cancellation Detail',
          action: "0251_view_detail"
        }
      },
      {
        path: 'approval-for-invoice-cancellation-detail/:invoiceNo/:invCancellationId',
        component: InvoiceCancellationDetailComponent,
        data: {
          title: 'Approval for Invoice Cancellation Detail',
          action: "0232_view_detail"
        }
      }
    ]
  },
  // {
  //   path: 'edc-test',
  //   component: EdcTestComponent
  // }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PaymentRoutingModule { }
