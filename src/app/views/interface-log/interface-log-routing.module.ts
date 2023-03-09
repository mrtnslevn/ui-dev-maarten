import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import {InterfaceLogDetailComponent} from "./interface-log-detail/interface-log-detail.component";
import {InterfaceLogComponent} from "./interface-log/interface-log.component";

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Interface Log',
    },
    canActivateChild: [AuthGuard],
    children:[
      {
        path: '',
        component: InterfaceLogComponent,
        data: {
          title: '',
          reuseComponent: false
        }
      },
      // {
      //   path: 'detail',
      //   component: InterfaceLogDetailComponent,
      //   data: {
      //     title: 'Interface Log Detail'
      //   }
      // },
      {
        path: 'detail/:log_id',
        component: InterfaceLogDetailComponent,
        data: {
          title: 'Interface Log Detail',
          action: "081_view_detail"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InterfaceLogRoutingModule { }
