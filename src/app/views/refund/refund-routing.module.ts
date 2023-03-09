import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { ApprovalForRefundReqComponent } from './approval-for-refund-req/approval-for-refund-req.component';
import { ApprovalRefundDepositIpdComponent } from './detail-approval-for-refund-req/approval-refund-deposit-ipd/approval-refund-deposit-ipd.component';
import { ApprovalRefundPrepaidComponent } from './detail-approval-for-refund-req/approval-refund-prepaid/approval-refund-prepaid.component';
import { RefundRevisionDepositIpdComponent } from './detail-refund-revision/refund-revision-deposit-ipd/refund-revision-deposit-ipd.component';
import { RefundRevisionPrepaidComponent } from './detail-refund-revision/refund-revision-prepaid/refund-revision-prepaid.component';
import { RefundDepositIpdComponent } from './detail-request-refund/refund-deposit-ipd/refund-deposit-ipd.component';
import { RefundInquiryDepositIpdDetailComponent } from './refund-inquiry-detail/refund-inquiry-deposit-ipd-detail/refund-inquiry-deposit-ipd-detail.component';
import { RefundInquiryPrepaidDetailComponent } from './refund-inquiry-detail/refund-inquiry-prepaid-detail/refund-inquiry-prepaid-detail.component';
import { RefundPrepaidDetailComponent } from './detail-request-refund/refund-prepaid-detail/refund-prepaid-detail.component';
import { RefundInquiryComponent } from './refund-inquiry/refund-inquiry.component';
import { RefundRevisionComponent } from './refund-revision/refund-revision.component';
import { RequestRefundComponent } from './request-refund/request-refund.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Refund',
    },
    // canActivateChild: [AuthGuard],
    children: [
      {
        path: '',
        redirectTo: 'refund'
      },
      {
        path: 'request-refund',
        component: RequestRefundComponent,
        data: {
          title: 'Request Refund',
          reuseComponent: false
        },
      },
      {
        path: 'refund-deposit-detail',
        component: RefundDepositIpdComponent,
        data: {
          title: 'Refund Deposit IPD',
          reuseComponent: false
        },
      },
      {
        path: 'refund-prepaid-detail',
        component: RefundPrepaidDetailComponent,
        data: {
          title: 'Refund Prepaid',
          reuseComponent: false
        },
      },
      {
        path: 'approval-for-refund-request',
        component: ApprovalForRefundReqComponent,
        data: {
          title: 'Approval for Refund Request',
          reuseComponent: false
        },
      },
      {
        path: 'approval-for-refund-request/refund-prepaid-approval-detail',
        component: ApprovalRefundPrepaidComponent,
        data: {
          title: 'Prepaid Refund Request',
          reuseComponent: false
        },
      },
      {
        path: 'approval-for-refund-request/refund-deposit-approval-detail',
        component: ApprovalRefundDepositIpdComponent,
        data: {
          title: 'Deposit IPD Refund Request',
          reuseComponent: false
        },
      },
      {
        path: 'refund-revision',
        component: RefundRevisionComponent,
        data: {
          title: 'Refund Revision',
          reuseComponent: false
        }
      },
      {
        path: 'refund-revision-deposit-ipd',
        component: RefundRevisionDepositIpdComponent,
        data: {
          title: 'Refund Revision Deposit IPD',
          reuseComponent: false
        }
      },
      {
        path: 'refund-revision-prepaid',
        component: RefundRevisionPrepaidComponent,
        data: {
          title: 'Refund Revision Prepaid',
          reuseComponent: false
        }
      },
      {
        path: 'refund-inquiry',
        component: RefundInquiryComponent,
        data: {
          title: 'Refund Revision',
          reuseComponent: false
        },
        children: [
          
        ]
      },
      {
        path: 'refund-inquiry/refund-inquiry-deposit-ipd-detail',
        component: RefundInquiryDepositIpdDetailComponent,
        data: {
          title: 'Refund Inquiry Deposit IPD',
          reuseComponent: false
        }
      },
      {
        path: 'refund-inquiry/refund-inquiry-prepaid-detail',
        component: RefundInquiryPrepaidDetailComponent,
        data: {
          title: 'Refund Inquiry Prepaid',
          reuseComponent: false
        }
      }

    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RefundRoutingModule { }
