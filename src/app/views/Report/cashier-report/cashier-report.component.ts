import {Component, OnInit} from "@angular/core";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-cashier-report',
  templateUrl: './cashier-report.component.html'
})


export class CashierReportComponent implements OnInit{

  loadPage: boolean = false
  showSummaryCard: boolean = true
  showCollectNet: boolean = false

  public panes = [
    {
      name: 'summary'
    },
    {
      name: 'Payment'
    },
    {
      name: "Bill"
    }
  ]

  activePane = 0;

  onTabChange($event: number){
    this.activePane = $event;
  }

  dataPayment =[
    {
      user: 'Maria Andreatea Ottemusu',
      isExpand: false,
      payment:[{
        method: 'Cash',
        isExpand: false,
        detail: [
          {
          type: 'payment',
          invoice_no: 'QIV1234578',
          invoice_date: '30-Jan-2023 09:31',
          transaction_no: 'DSP1234567',
          settlement_date: '30-Jan-2023 09:31',
          cashier: 'Maria andreatea Ottemusu',
          cancel_date: '',
          cancel_cashier: '',
          MR_no:'00-26-04-34',
          name: 'ANA MARIA PINGKA P.O.',
          net_amount: '336,000'
        }
        ]
      }
      ]
    }
  ]

  data = [
    {
      headname:'Collection Net',
      isExpand:true,
      details:[
        {
          desc:'Additional Payer',
          count:'0',
          amount:'0'
        },
        {
          desc: 'Cash',
          count: '1',
          amount: '336,000',
        },
        {
          desc: 'Credit Card',
          count: '0',
          amount: '0',
        }
      ]
    },
    {
      headname:'Payment',
      isExpand: true,
      details:[
        {
          desc:'Additional Payer',
          count:'0',
          amount:'0'
        },
        {
          desc: 'Cash',
          count: '1',
          amount: '336,000',
        },
        {
          desc: 'Credit Card',
          count: '0',
          amount: '0',
        }
      ]
    },
    {
      headname:'Bill',
      isExpand: true,
      details:[
        {
          desc:'Invoice Net',
          count:'28',
          amount:'1,493,000'
        },
        {
          desc: 'Patient Net',
          count: '28',
          amount: '336,000',
        },
        {
          desc: 'Payer Balance',
          count: '28',
          amount: '1,157,800',
        }
      ]
    },


]

  constructor( private  router: Router, private route: ActivatedRoute) {
  }


  ngOnInit(): void {
  }
}
