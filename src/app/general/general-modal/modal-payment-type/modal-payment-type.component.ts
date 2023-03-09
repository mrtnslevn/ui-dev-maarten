import { HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { InvoiceInquiryService } from 'src/app/service/invoice-inquiry.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { GetPaymentDetailResponse } from '../../models/response/GetPaymentDetailResponse';
import { Edc } from '../../models/div-card-payment/Edc';

@Component({
  selector: 'app-modal-payment-type',
  templateUrl: './modal-payment-type.component.html',
  styleUrls: ['./modal-payment-type.component.scss']
})
export class ModalPaymentTypeComponent implements OnInit {
  settlement_no?: any
  org_id: number = 0

  paymentId: number = 0
  params: any
  paymentDetail: any
  data: any;

  loadPage: boolean = false;
  
  getPaymentDetailResponse: GetPaymentDetailResponse | undefined;

  constructor(public bsModalRef: BsModalRef, private invoiceInquiryService: InvoiceInquiryService, 
    private token: TokenStorageService, private alertService: ModalAlertService) { }

  ngOnInit(): void {
    const userData = this.token.getUserData();
    this.org_id = userData.hope_organization_id;
    this.getPaymentDetail()
  }
  
  getPaymentDetail(){
    this.loadPage = true;
    this.params = new HttpParams()
    .set('settlement_no', this.settlement_no)
    .set('org_id', this.org_id)
    return this.invoiceInquiryService.getPaymentDetail(this.params)
    .subscribe((data: GetPaymentDetailResponse)=>
    {
      this.getPaymentDetailResponse = {...data};
      if(this.getPaymentDetailResponse?.response_code == RESPONSE_SUCCESS){
        this.paymentDetail = this.getPaymentDetailResponse;
        this.paymentId = this.paymentDetail.payment_mode_id
        this.setDataDetail(this.paymentId, this.getPaymentDetailResponse)
      }else{
        this.alertService.showModalAlert(`Failed to get mcu package list: ${this.getPaymentDetailResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadPage = false;
    }, err => {
      this.loadPage = false;
    });
  }

  setDataDetail(id: number, data: any){
    switch(id){
      case 1:
        this.data = data.cash
        this.data.notes = data.notes
        break;

      case 2:
      case 3:
        let edc: Edc = {...data}
        this.data = data.card
        if (this.data.card_expiry_date != undefined && this.data.card_expiry_date != "") {
          let year: string = `20${this.data.card_expiry_date[2]}${this.data.card_expiry_date[3]}`
          let month: string = `${this.data.card_expiry_date[0]}${this.data.card_expiry_date[1]}`
          edc.card_expiry_date = `${year}-${month}`
        }
        this.data.notes = data.notes
        break;

      case 4:
        this.data = data.cheque_giro
        this.data.notes = data.notes
        break;

      case 5:
        this.data = data.voucher
        this.data.notes = data.notes
        break;

      case 6:
        this.data = data.bank_transfer
        this.data.notes = data.notes
        break;

      case 7:
        this.data = data.deposit_ipd
        this.data.notes = data.notes
        break;

      case 9:
        this.data = data.additional_payer
        this.data.notes = data.notes
        break;

      case 10:
        this.data = data.digital_payment
        this.data.notes = data.notes
        break;

      case 11:
        this.data = data.qris
        this.data.notes = data.notes
        break;

      case 12:
        this.data = data.prepaid
        this.data.notes = data.notes
        break;
    }
  }

}
