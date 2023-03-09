import { INavData } from '@coreui/angular';

export interface ActionPrivilege {
  action_id?: string,
  action_name?: string
}

export interface PrivilegeAccess extends Omit<INavData, 'children'> {
  module_id?: string,
  module_type?: string,
  parent_module_id?: string,
  children?: PrivilegeAccess[],
  action_list?: ActionPrivilege[]
}

export const navItems: INavData[] = [
  {
    name: 'Dashboard',
    url: '/dashboard',
    iconComponent: { name: 'cil-speedometer' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Queue Management',
    url: '/queue-management',
    iconComponent: { name: 'cil-layers' },
    badge: {
      color: 'info',
      text: 'NEW'
    }
  },
  {
    name: 'Discharge',
    url: '/discharge',
    iconComponent: { name: 'cil-hospital' },
    children: [
      {
        name: 'Final Discharge',
        url: '/discharge/final-discharge'
      },
      {
        name: 'Discharge List',
        url: '/discharge/discharge-list'
      }
    ]
  },
  {
    name: 'Payment',
    url: '/payment',
    iconComponent: { name: 'cil-money' },
    children: [
      {
        name: 'Payment',
        url: '/payment/payment'
      },
      {
        name: 'Invoice List',
        url: '/payment/invoice-list'
      },
      {
        name: 'Payment List',
        url: '/payment/payment-list'
      },
      {
        name: 'Approval for Invoice Cancellation',
        url: '/payment/approval-for-invoice-cancellation'
      },
      {
        name: 'Approval for Payment Cancellation',
        url: '/payment/approval-for-payment-cancellation'
      },
    ]
  },
  {
    name: 'Prepaid',
    url: '/prepaid',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Booking and Payment',
        url: '/prepaid/booking-and-payment'
      },
      {
        name: 'Prepaid List',
        url: '/prepaid/prepaid-list'
      },
    ]
  },
  {
    name: 'Deposit IPD',
    url: '/deposit-ipd',
    iconComponent: { name: 'cil-notes' },
    children: [
      {
        name: 'Deposit IPD Payment',
        url: '/deposit-ipd/deposit-ipd-payment'
      },
      {
        name: 'Deposit IPD List',
        url: '/deposit-ipd/deposit-ipd-list'
      },
      {
        name: 'Deposit IPD History',
        url: '/deposit-ipd/deposit-ipd-history'
      },
      {
        name: 'Deposit IPD Transaction',
        url: '/deposit-ipd/deposit-ipd-transaction'
      }
  ]
  },
  {
    name: 'Refund',
    iconComponent: { name: 'cil-notes' },
    url: '/refund',
    children: [
      {
        name: 'Request Refund',
        url: '/refund/request-refund'
      },
      {
        name: 'Approval for Refund request',
        url: '/refund/approval-for-refund-request'
      },
      {
        name: 'Refund Revision',
        url: '/refund/refund-revision'
      },
      {
        name: 'Refund Inquiry',
        url: '/refund/refund-inquiry'
      }
    ]
  },
  {
    name: 'Voucher Sales',
    url: '/voucher-sales',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Voucher Sales',
        url: '/voucher-sales/index'
      },
      {
        name: 'Voucher Sales List',
        url: '/voucher-sales/voucher-sales-list'
      }
    ]
  },
  {
    name: 'Report',
    url: '/report',
    iconComponent: { name: 'cil-bell' },
    children: [
      {
        name: 'Cashier Report',
        url: '/report/cashier-report'
      },
      {
        name: 'Voucher Sales',
        url: '/report/1'
      },
      {
        name: 'Voucher Sales List',
        url: '/report/2'
      }
    ]
  },
  {
    name: 'Interface Log',
    url: '/interface-log',
    iconComponent: { name: 'cil-calculator' },
  },
  // {
  //   name: 'Cashier Report',
  //   url: '/cashier-report',
  //   iconComponent: { name: 'cil-calculator' },
  // },
  {
    name: 'Configuration',
    url: '/configuration',
    iconComponent: { name: 'cil-star' },
    children: [
      {
        name: 'General Master',
        url: '/login'
      },
      {
        name: 'Email Setup',
        url: '/register'
      },
      {
        name: 'Interface Setup',
        url: '/404'
      },
      {
        name: 'Journal Setup',
        url: '/500'
      },
      {
        name: 'Role Access List',
        url: '/login'
      },
      {
        name: 'Deposit OPD Setup',
        url: '/register'
      },
      {
        name: 'Final Discharge Setup',
        url: '/404'
      },
      {
        name: 'Whatsapp Setup',
        url: '/500'
      },
      {
        name: 'Approval Workflow Configuration',
        url: '/500'
      }
    ]
  },
];
