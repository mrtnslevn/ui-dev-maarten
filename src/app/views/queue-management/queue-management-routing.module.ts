import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';

import { QueueManagementComponent } from './queue-management.component';

const routes: Routes = [
  {
    path: '',
    component: QueueManagementComponent,
    data: {
      title: $localize`Queue Management`
    },
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class QueueManagementRoutingModule {
}
