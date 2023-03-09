import {NgModule} from "@angular/core";
import {CashierReportComponent} from "./cashier-report/cashier-report.component";
import {GeneralModule} from "../../general/general.module";
import {ReportRoutingModule} from "./report-routing.module";
import {NgxContextModule} from "ngx-context";
import {CollapseModule} from "ngx-bootstrap/collapse";
import {NavModule, TabsModule} from "@coreui/angular";

@NgModule({
  declarations: [
    CashierReportComponent
  ],
  imports: [
    GeneralModule,
    ReportRoutingModule,
    NgxContextModule,
    CollapseModule,
    NavModule,
    TabsModule,
  ]
})

export class ReportModule {}
