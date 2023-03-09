import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { GeneralService } from 'src/app/service/general.service';
import { InvoiceCancellationService } from 'src/app/service/invoice-cancellation.service';
import { InvoiceInquiryService } from 'src/app/service/invoice-inquiry.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { PaymentCancellationService } from 'src/app/service/payment-cancellation.service';
import { ALERT_DANGER, ALERT_SUCCESS, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { ModalDefaultConfig } from 'src/app/_configs/modal-config';
import { CancelRejectReason } from '../../models/CancelRejectReason';
import { Payment_Settlement } from '../../models/Payment_Settlement';
import { SaveApprovalReq } from '../../models/request/SaveApprovalReq';
import { GetListResponse } from '../../models/response/GetListResponse';
import { SaveApprovalResponse } from '../../models/response/SaveApprovalResponse';
import { ModalAlertConfirmComponent } from '../modal-alert-confirm/modal-alert-confirm.component';

@Component({
  selector: 'app-modal-reject-accept-revision-refund',
  templateUrl: './modal-reject-accept-revision-refund.component.html',
  styleUrls: ['./modal-reject-accept-revision-refund.component.scss']
})
export class ModalRejectAcceptRevisionRefundComponent implements OnInit {
  @Input() title: string = ""
  @Input() type: string = ""
  @Input() approve: boolean = false
  @Input() statusPage: string = ""
  @Input() id: string = ""
  @Input() invoiceNo: string = ""
  @Output() newItemEvent = new EventEmitter<string>()

  notes: string = ""

  getListResponse: any = {}
  listCancelReason: CancelRejectReason[] = []
  selectedCancelReason: CancelRejectReason = {key: '', value: ''}

  params: SaveApprovalReq = {
    appr_type: "",
    reject_reason_id: 0,
    approval_notes: ""
  }

  bsModalShowAlert?: BsModalRef
  bsModalShowAlertConfirm?: BsModalRef

  saveApprResponse: SaveApprovalResponse = {}
  progress: boolean = false

  getPaymentSettlementResponse: any
  dataCekPayment: Payment_Settlement[] = [];

  public visible = false;
  constructor(
    public bsModalRef: BsModalRef, private generalService: GeneralService,
    private invoiceCancellationService: InvoiceCancellationService,
    private paymentCancellationService: PaymentCancellationService,
    private invoiceInquiry: InvoiceInquiryService,
    private router: Router,
    private bsModalService : BsModalService,
    private alertService: ModalAlertService
  ) { }

  ngOnInit(): void {
  }

  showModalConfirm(message: string){
    const initialState: ModalOptions = {
      initialState: {
        message: message,
      },
    };
    this.bsModalShowAlertConfirm = this.bsModalService.show(ModalAlertConfirmComponent, Object.assign(ModalDefaultConfig, initialState))
    return this.bsModalShowAlertConfirm.content.isConfirm
  }

  getList(){
    const params = new HttpParams()
    .set('param_list', 'cancelInvoiceRejectReasonList')
    .append('param_list', 'cancelPaymentRejectReasonList');

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          if(this.statusPage=="invoice"){
            this.listCancelReason = this.getListResponse.cancelInvoiceRejectReasonList;
          }else{
            this.listCancelReason = this.getListResponse.cancelPaymentRejectReasonList;
          }
        }else{
          this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
      });
  } 
  
  onChangeCancelReason(selected: any){
    this.selectedCancelReason = selected;
    this.params.reject_reason_id = selected.key
  }
  
  onChangeNotes(e: any){
    this.notes = e
    this.params.approval_notes = e
  }

  submitCancellation(){
    if(this.statusPage=="invoice" && this.approve){
      this.checkPaymentSettlement()
    }else{
      this.submitApproval()
    }
  }

  checkPaymentSettlement(){
    this.progress = true

    const params = new HttpParams()
    .set('transaction_type', 'Payment')
    .set('transaction_no', this.invoiceNo)
    .set('page_no', 1)
      
    return this.invoiceInquiry.getPaymentSettlement(params)
    .subscribe((data)=>{
      this.getPaymentSettlementResponse = {...data}
      if(this.getPaymentSettlementResponse.response_code===RESPONSE_SUCCESS){
        this.dataCekPayment = data.payment_settlement_list
        if(this.dataCekPayment.length>0){
          this.alertApproval()
        }else{
          this.submitApproval()
        }
      }else{
        this.alertService.showModalAlert(`Failed to check payment settlement: ${this.getPaymentSettlementResponse.response_desc}`,ALERT_DANGER)
        this.progress = false
      }
    },err => {
      this.alertService.showModalAlert(`An error has occured while check payment settlement, please contact administration`, ALERT_DANGER)
      this.progress = false
    })
  }


  alertApproval(){
    this.showModalConfirm(`There is payment settlement linked to this invoice. By cancelling the transaction, the payment(s) are going to be cancelled. Are you sure to ${this.approve ? 'approve' : 'reject'} this cancellation?`).subscribe((item: any)=>{
      this.submitApproval();
    })
  }

  submitApproval(){
    this.progress = true
    return this.statusPage=="invoice" ? this.invoiceCancellationService.saveApproval(this.params)
      .subscribe((data: SaveApprovalResponse)=>
      {
        this.saveApprResponse = {...data};
        if(this.saveApprResponse.response_code === RESPONSE_SUCCESS){
          this.alertService.showModalAlert(`Cancelling invoice has been ${this.approve ? 'approved' : 'rejected'}`,ALERT_SUCCESS)
          this.bsModalRef.hide()
          this.router.navigate(['payment/approval-for-invoice-cancellation'])
        }else{
          this.alertService.showModalAlert(`Failed to cancelling the invoice: ${this.saveApprResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false
      }, err => {
        this.progress = false
        this.alertService.showModalAlert(`An error has occured while cancelling the invoice, please contact administration`, ALERT_DANGER)
      })
    :
      this.paymentCancellationService.saveApproval(this.params)
      .subscribe((data: SaveApprovalResponse)=>
      {
        this.saveApprResponse = {...data};
        if(this.saveApprResponse.response_code === RESPONSE_SUCCESS){
          this.alertService.showModalAlert(`Cancelling payment has been ${this.approve ? 'approved' : 'rejected'}`,ALERT_SUCCESS)
          this.bsModalRef.hide()
          this.router.navigate(['payment/approval-for-payment-cancellation'])
        }else{
          this.alertService.showModalAlert(`Failed to cancelling the payment: ${this.saveApprResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false
      }, err => {
        this.progress = false
        this.alertService.showModalAlert(`An error has occured while cancelling the invoice, please contact administration`, ALERT_DANGER)
      })
  }

}
