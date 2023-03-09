import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { DischargeListDetailComponent } from './discharge-list-detail/discharge-list-detail.component';
import { DischargeListComponent } from './discharge-list/discharge-list.component';
import { FinalDischargeComponent } from './final-discharge/final-discharge.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Discharge',
    },
    canActivate: [AuthGuard],
    canActivateChild: [AuthGuard],
    children:[
      {
        path: '',
        redirectTo: 'final-discharge'
      },
      {
        path:'final-discharge',
        component: FinalDischargeComponent,
        data: {
          title: 'Final Discharge'
        }
      },
      {
        path: 'discharge-list',
        component: DischargeListComponent,
        data: {
          title: 'Discharge List'
        },
      },
      {
        path: 'discharge-list-detail/:admissionNo/:mrNo',
        component: DischargeListDetailComponent,
        data: {
          title: 'Discharge List Detail',
          action: "0122_detail"
        },
      }
    ]
  }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DischargeRoutingModule { }
