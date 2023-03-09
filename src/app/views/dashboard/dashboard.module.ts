import { NgModule } from '@angular/core';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { GeneralModule } from 'src/app/general/general.module';
import { NgxContextModule } from 'ngx-context';

@NgModule({
  imports: [
    GeneralModule,
    DashboardRoutingModule,
    NgxContextModule
  ],
  declarations: [DashboardComponent]
})
export class DashboardModule {
}
