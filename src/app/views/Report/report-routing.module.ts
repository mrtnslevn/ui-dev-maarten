import {RouterModule, Routes} from "@angular/router";
import {AuthGuard} from "../../guards/auth.guard";
import {CashierReportComponent} from "./cashier-report/cashier-report.component";
import {NgModule} from "@angular/core";


const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Report'
    },
    // canActivateChild: AuthGuard,
    children:[
      {
        path: '',
        redirectTo: 'report'
      },
      {
        path: 'report',
        data: {
          title: 'Report',
          reuseComponent: false,
        }
      },
      {
        path: 'cashier-report',
        component: CashierReportComponent,
        data: {
          title: 'Cashier Report',
          reuseComponent: false
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule{ }
