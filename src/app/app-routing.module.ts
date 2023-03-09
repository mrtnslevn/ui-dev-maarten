import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { DefaultLayoutComponent } from './containers';
import { Page404Component } from './views/pages/page404/page404.component';
import { Page500Component } from './views/pages/page500/page500.component';
import { LoginComponent } from './views/pages/login/login.component';
import { RegisterComponent } from './views/pages/register/register.component';
import { ForgetPasswordComponent } from './views/pages/forget-password/forget-password.component';
import { ChangePasswordComponent } from './views/pages/change-password/change-password.component';
import { LoginGuard } from './guards/login.guard';
import { EdcTestComponent } from './views/payment/edc-test/edc-test.component';
import {CashierReportComponent} from "./views/Report/cashier-report/cashier-report.component";

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: '',
    component: DefaultLayoutComponent,
    data: {
      title: 'Home',
      action: "0222_view_detail"
    },
    children: [
      {
        path: 'dashboard',
        loadChildren: () =>
          import('./views/dashboard/dashboard.module').then((m) => m.DashboardModule),
      },
      {
        path: 'queue-management',
        loadChildren: () =>
          import('./views/queue-management/queue-management.module').then((m) => m.QueueManagementModule),
      },
      {
        path: 'pages',
        loadChildren: () =>
          import('./views/pages/pages.module').then((m) => m.PagesModule)
      },
      {
        path: 'discharge',
        loadChildren: () => import('./views/discharge/discharge.module').then((m) => m.DischargeModule)
      },
      {
        path: 'deposit-ipd',
        loadChildren: () => import('./views/deposit-ipd/deposit-ipd.module').then((m) => m.DepositIpdModule)
      },
      {
        path: 'payment',
        loadChildren: () => import('./views/payment/payment.module').then((m) => m.PaymentModule),
      },
      {
        path: 'prepaid',
        loadChildren: () => import('./views/prepaid/prepaid.module').then((m) => m.PrepaidModule)
      },
      {
        path: 'refund',
        loadChildren: () => import('./views/refund/refund.module').then((m) => m.RefundModule)
      },

      {
        path: 'interface-log',
        loadChildren: () => import('./views/interface-log/interface-log.module').then((m) => m.InterfaceLogModule)
      },
      {
        path: 'report',
        loadChildren: () =>import('./views/Report/report.module').then((m)=>m.ReportModule)
      }
    ]
  },
  {
    path: '404',
    component: Page404Component,
    data: {
      title: 'Page 404'
    }
  },
  {
    path: '500',
    component: Page500Component,
    data: {
      title: 'Page 500'
    }
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [LoginGuard],
    data: {
      title: 'Login Page'
    }
  },
  {
    path: 'forget-password',
    component: ForgetPasswordComponent,
    data: {
      title: 'Forgot Password Page'
    }
  },
  {
    path: 'change-password/:username',
    component: ChangePasswordComponent,
    data: {
      title: 'Change Password Page'
    }
  },
  {
    path: 'register',
    component: RegisterComponent,
    data: {
      title: 'Register Page'
    }
  },
  {
    path: 'edc-test',
    component: EdcTestComponent
  },
  {path: '**', redirectTo: 'dashboard'},
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      onSameUrlNavigation: 'reload',
      scrollPositionRestoration: 'top',
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking'
      // relativeLinkResolution: 'legacy'
    })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
