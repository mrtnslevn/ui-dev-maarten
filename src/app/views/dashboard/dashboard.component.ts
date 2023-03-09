import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BsModalRef} from 'ngx-bootstrap/modal';
import { PrivilegeAccess } from 'src/app/containers/default-layout/_nav';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';

import { DashboardChartsData, IChartProps } from './dashboard-charts-data';

interface IUser {
  name: string;
  state: string;
  registered: string;
  country: string;
  usage: number;
  period: string;
  payment: string;
  activity: string;
  avatar: string;
  status: string;
  color: string;
}

@Component({
  templateUrl: 'dashboard.component.html',
  styleUrls: ['dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  constructor(private chartsData: DashboardChartsData,
    private router: Router,
    private generalService: GeneralService,
    private alertService: ModalAlertService) {
  }

  public users: IUser[] = [
    {
      name: 'Yiorgos Avraamu',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Us',
      usage: 50,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Mastercard',
      activity: '10 sec ago',
      avatar: './assets/img/avatars/1.jpg',
      status: 'success',
      color: 'success'
    },
    {
      name: 'Avram Tarasios',
      state: 'Recurring ',
      registered: 'Jan 1, 2021',
      country: 'Br',
      usage: 10,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Visa',
      activity: '5 minutes ago',
      avatar: './assets/img/avatars/2.jpg',
      status: 'danger',
      color: 'info'
    },
    {
      name: 'Quintin Ed',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'In',
      usage: 74,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Stripe',
      activity: '1 hour ago',
      avatar: './assets/img/avatars/3.jpg',
      status: 'warning',
      color: 'warning'
    },
    {
      name: 'Enéas Kwadwo',
      state: 'Sleep',
      registered: 'Jan 1, 2021',
      country: 'Fr',
      usage: 98,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Paypal',
      activity: 'Last month',
      avatar: './assets/img/avatars/4.jpg',
      status: 'secondary',
      color: 'danger'
    },
    {
      name: 'Agapetus Tadeáš',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Es',
      usage: 22,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'ApplePay',
      activity: 'Last week',
      avatar: './assets/img/avatars/5.jpg',
      status: 'success',
      color: 'primary'
    },
    {
      name: 'Friderik Dávid',
      state: 'New',
      registered: 'Jan 1, 2021',
      country: 'Pl',
      usage: 43,
      period: 'Jun 11, 2021 - Jul 10, 2021',
      payment: 'Amex',
      activity: 'Yesterday',
      avatar: './assets/img/avatars/6.jpg',
      status: 'info',
      color: 'dark'
    }
  ];
  public mainChart: IChartProps = {};
  public chart: Array<IChartProps> = [];
  public trafficRadioGroup = new FormGroup({
    trafficRadio: new FormControl('Month')
  });

  public session_timeout: any
  approval_for_payment_cancellation: number = 0
  approval_for_invoice_cancellation: number = 0
  pending_invoice: number = 0

  bsModalShowAlert?: BsModalRef

  ngOnInit(): void {
    this.getDashboardNotification()
    this.initCharts();
  }

  getDashboardNotification(){
    this.generalService.getDashboardNotification().subscribe(
      data => {
        if (data.response_code == RESPONSE_SUCCESS) {
          this.approval_for_invoice_cancellation = data.approval_for_invoice_cancellation
          this.approval_for_payment_cancellation = data.approval_for_payment_cancellation
          this.pending_invoice = data.pending_invoice
        }else{
          this.alertService.showModalAlert(`Failed to : ${data.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get dashboard notification, please contact administration`, ALERT_DANGER)
      }
    );
  }
  
  checkUrl(privilege: PrivilegeAccess[], id: string) {
    const filtered: PrivilegeAccess | undefined = this.getPrivilege(privilege, id);
    return filtered != undefined ? true : false
  }

  getPrivilege(privilege: PrivilegeAccess[], id: string) {
    let filtered: PrivilegeAccess | undefined;

    for (let i = 0; i < privilege.length; i++) {
      let p = privilege[i];
      if (p.module_id == id) {
        filtered = p;
        break;
      }

      if (p.module_type == "MENU_FOLDER" && p.children != null) {
        filtered = this.getPrivilege(p.children, id);
        if (filtered != undefined) break; 
      }
    }

    return filtered;
  }

  onClickAppPaymentCancellation(){
    this.router.navigate(['payment/approval-for-payment-cancellation'])
  }

  onClickAppInvoiceCancellation(){
    this.router.navigate(['payment/approval-for-invoice-cancellation'])
  }

  onClickAppPendingInvoice(){
    this.router.navigate(['payment/invoice-list'])
  }

  initCharts(): void {
    this.mainChart = this.chartsData.mainChart;
  }

  setTrafficPeriod(value: string): void {
    this.trafficRadioGroup.setValue({ trafficRadio: value });
    this.chartsData.initMainChart(value);
    this.initCharts();
  }
}
