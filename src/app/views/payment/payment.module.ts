import { NgModule } from '@angular/core';
import { PaymentRoutingModule } from './payment-routing.module';
import { PaymentComponent } from './payment/payment.component';
import { InvoiceListComponent } from './invoice-list/invoice-list.component';
import { PaymentListComponent } from './payment-list/payment-list.component';
import { ApprovalInvoiceCancellationComponent } from './approval-invoice-cancellation/approval-invoice-cancellation.component';
import { ApprovalPaymentCancellationComponent } from './approval-payment-cancellation/approval-payment-cancellation.component';
import { GeneralModule } from 'src/app/general/general.module';
import { PaymentCancellationDetailComponent } from './payment-cancellation-detail/payment-cancellation-detail.component';
import { InvoiceListDetailComponent } from './invoice-list-detail/invoice-list-detail.component';
import { PaymentListDetailComponent } from './payment-list-detail/payment-list-detail.component';
import { InvoiceCancellationDetailComponent } from './invoice-cancellation-detail/invoice-cancellation-detail.component';
import { NgxContextModule } from 'ngx-context';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { EdcTestComponent } from './edc-test/edc-test.component';

@NgModule({
  declarations: [
    PaymentComponent,
    InvoiceListComponent,
    PaymentListComponent,
    ApprovalInvoiceCancellationComponent,
    ApprovalPaymentCancellationComponent,
    PaymentCancellationDetailComponent,
    InvoiceListDetailComponent,
    PaymentListDetailComponent,
    InvoiceCancellationDetailComponent,
    EdcTestComponent
  ],
  imports: [
    GeneralModule,
    PaymentRoutingModule,
    NgxContextModule,
    PaginationModule.forRoot()
  ]
})
export class PaymentModule { }
