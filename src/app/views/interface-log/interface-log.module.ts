import { NgModule } from '@angular/core';
import { InterfaceLogComponent } from './interface-log/interface-log.component';
import { InterfaceLogDetailComponent } from './interface-log-detail/interface-log-detail.component';
import {GeneralModule} from "../../general/general.module";
import {InterfaceLogRoutingModule} from "./interface-log-routing.module";
import { NgxContextModule } from 'ngx-context';
import { PaginationModule } from 'ngx-bootstrap/pagination';



@NgModule({
  declarations: [
    InterfaceLogComponent,
    InterfaceLogDetailComponent
  ],
  imports: [
    GeneralModule,
    InterfaceLogRoutingModule,
    NgxContextModule,
    PaginationModule.forRoot()
  ]
})
export class InterfaceLogModule { }
