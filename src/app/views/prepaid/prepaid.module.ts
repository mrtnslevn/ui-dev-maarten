import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PrepaidRoutingModule } from './prepaid-routing.module';
import { PrepaidListComponent } from './prepaid-list/prepaid-list.component';
import { BookingPaymentComponent } from './booking-payment/booking-payment.component';
import { PrepaidListDetailComponent } from './prepaid-list-detail/prepaid-list-detail.component';
import { GeneralModule } from 'src/app/general/general.module';
import { GridModule, SharedModule, UtilitiesModule, ModalModule, } from '@coreui/angular';
import {TableModule} from '@coreui/angular';
import { NgxContextModule } from 'ngx-context';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';

@NgModule({
  declarations: [
    PrepaidListComponent,
    BookingPaymentComponent,
    PrepaidListDetailComponent
  ],
  imports: [
    PrepaidRoutingModule,
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
export class PrepaidModule { }
