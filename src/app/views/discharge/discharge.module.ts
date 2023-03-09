import { NgModule } from '@angular/core';
import { DischargeRoutingModule } from './discharge-routing.module';
import { DischargeListComponent } from './discharge-list/discharge-list.component';
import { FinalDischargeComponent } from './final-discharge/final-discharge.component';
import { GeneralModule } from 'src/app/general/general.module';
import { FormsModule } from '@angular/forms';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { NgxContextModule } from 'ngx-context';
import { DischargeListDetailComponent } from './discharge-list-detail/discharge-list-detail.component';


@NgModule({
  declarations: [
    DischargeListComponent,
    DischargeListDetailComponent,
    FinalDischargeComponent
  ],
  imports: [
    GeneralModule,
    NgxContextModule,
    DischargeRoutingModule,
    PaginationModule.forRoot()
  ]
})
export class DischargeModule { }
