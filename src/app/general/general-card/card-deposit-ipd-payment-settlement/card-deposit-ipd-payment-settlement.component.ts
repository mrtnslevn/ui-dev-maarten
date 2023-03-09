import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit } from '@angular/core';
import { ModalOptions } from 'ngx-bootstrap/modal';
import { DepositIpdService } from 'src/app/service/deposit-ipd.service';

@Component({
  selector: 'app-card-deposit-ipd-payment-settlement',
  templateUrl: './card-deposit-ipd-payment-settlement.component.html',
  styleUrls: ['./card-deposit-ipd-payment-settlement.component.scss']
})
export class CardDepositIpdPaymentSettlementComponent implements OnInit {
    @Input() show: boolean = true;

  constructor(private depositIpdService: DepositIpdService,
    ) { }

  ngOnInit(): void {

  }

  settlementList: any = [{
    deposit_no: "DEP123",
    payment_mode: "Cash",
    account_no: "123",
    account_name: "Abigael Vaneakh",
    net: 1000000,
    notes: "Ini acatata",
    deposit_by: "user.payment"
  }]

  

  // showSendPrintModal(type: string) {
    
  //   const initialState: ModalOptions = {
  //     initialState: {
  //       modalType: type,
  //       type: "deposit",
  //       id: this.type=='payment' ? this.invoice.invoice_no : this.prepaidId,
  //       printOriManyTimes: this.isPrintOriManytimes
  //     },
  //   };
  //   this.bsModal = this.bsModalService.show(ModalSendPrintComponent, Object.assign(ModalLargeConfig, initialState));
  // }


  // getPaymentSettle(){
  //   const params: HttpParams = new HttpParams()
  //   .set("mr_no", )
  //   .set("org_id",)
  //   .set("patient_name")
  //   .set("dob")
  //   .set("deposit_no")
  //   .set("deposit_date_from")
  //   .set("deposit_date_to")
  //   .set("page_no", 1).;

  //   this.depositIpdService.getSettlement(params).subscribe((data) =>{

  //   },  err => {
  //     this.alertService.showModalAlert(`An error has occured while get data payment settlement , please contact administration`, ALERT_DANGER)
  //   });

  // }


}