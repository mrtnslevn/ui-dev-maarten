import { NgModule } from '@angular/core';
import { RefundRoutingModule } from './refund-routing.module';
import { GeneralModule } from 'src/app/general/general.module';
import { GridModule, SharedModule, UtilitiesModule, ModalModule, } from '@coreui/angular';
import {TableModule} from '@coreui/angular';
import { NgxContextModule } from 'ngx-context';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { RequestRefundComponent } from './request-refund/request-refund.component';
import { ApprovalForRefundReqComponent } from './approval-for-refund-req/approval-for-refund-req.component';
import { RefundRevisionComponent } from './refund-revision/refund-revision.component';
import { RefundInquiryComponent } from './refund-inquiry/refund-inquiry.component';
import { RefundDepositIpdComponent } from './detail-request-refund/refund-deposit-ipd/refund-deposit-ipd.component';
import { RefundPrepaidDetailComponent } from './detail-request-refund/refund-prepaid-detail/refund-prepaid-detail.component';
import { ApprovalRefundDepositIpdComponent } from './detail-approval-for-refund-req/approval-refund-deposit-ipd/approval-refund-deposit-ipd.component';
import { ApprovalRefundPrepaidComponent } from './detail-approval-for-refund-req/approval-refund-prepaid/approval-refund-prepaid.component';
import { RefundInquiryDepositIpdDetailComponent } from './refund-inquiry-detail/refund-inquiry-deposit-ipd-detail/refund-inquiry-deposit-ipd-detail.component';
import { RefundInquiryPrepaidDetailComponent } from './refund-inquiry-detail/refund-inquiry-prepaid-detail/refund-inquiry-prepaid-detail.component';
import { RefundRevisionDepositIpdComponent } from './detail-refund-revision/refund-revision-deposit-ipd/refund-revision-deposit-ipd.component';
import { RefundRevisionPrepaidComponent } from './detail-refund-revision/refund-revision-prepaid/refund-revision-prepaid.component';

@NgModule({
  declarations: [
    RequestRefundComponent,
    ApprovalForRefundReqComponent,
    RefundRevisionComponent,
    RefundInquiryComponent,
    RefundDepositIpdComponent,
    RefundPrepaidDetailComponent,
    ApprovalRefundDepositIpdComponent,
    ApprovalRefundPrepaidComponent,
    RefundInquiryDepositIpdDetailComponent,
    RefundInquiryPrepaidDetailComponent,
    RefundRevisionDepositIpdComponent,
    RefundRevisionPrepaidComponent
  ],
  imports: [
    RefundRoutingModule,
    GeneralModule,
    GridModule,
    UtilitiesModule,
    SharedModule,
    TableModule,
    ModalModule,
    NgxContextModule,
    NgSelectModule,
    PaginationModule.forRoot(),
    BsDatepickerModule.forRoot(),
  ]
})   
export class RefundModule { }
