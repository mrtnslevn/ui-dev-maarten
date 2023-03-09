import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/guards/auth.guard';
import { BookingPaymentComponent } from './booking-payment/booking-payment.component';
import { PrepaidListDetailComponent } from './prepaid-list-detail/prepaid-list-detail.component';
import { PrepaidListComponent } from './prepaid-list/prepaid-list.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Prepaid',
    },
    canActivateChild: [AuthGuard],
    children:[
      {
        path: '',
        redirectTo: 'booking-and-payment'
      },
      {
        path: 'booking-and-payment',
        component: BookingPaymentComponent,
        data: {
          title: 'Booking and Payment',
          reuseComponent: false
        }
      },
      {
        path:'prepaid-list',
        component: PrepaidListComponent,
        data: {
          title: 'Prepaid List',
          reuseComponent: false
        }
      },
      {
        path:'prepaid-list-detail/:bookId/:prepaidId',
        component: PrepaidListDetailComponent,
        data: {
          title: 'Prepaid List Detail',
          action: "0321_view_detail"
        }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PrepaidRoutingModule { }
