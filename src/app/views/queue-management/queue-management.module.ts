import { SafePipeModule } from 'safe-pipe';
import { NgModule } from '@angular/core';
import { QueueManagementRoutingModule } from './queue-management-routing.module'
import { QueueManagementComponent } from './queue-management.component';
import { GeneralModule } from 'src/app/general/general.module';
import { NgxContextModule } from 'ngx-context';

@NgModule({
  imports: [
    GeneralModule,
    QueueManagementRoutingModule,
    NgxContextModule,
    SafePipeModule,
  ],
  declarations: [QueueManagementComponent]
})

export class QueueManagementModule {
}