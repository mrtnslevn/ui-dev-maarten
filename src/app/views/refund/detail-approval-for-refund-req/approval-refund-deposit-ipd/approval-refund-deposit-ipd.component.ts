import { Component, OnInit } from '@angular/core';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ApprovalRefundRequest } from 'src/app/general/models/ApprovalRefundRequest';
import { Paging } from 'src/app/general/models/Paging';
import { GetApprovalRefundRequestResponse } from 'src/app/general/models/response/GetApprovalRefundRequestResponse';

@Component({
  selector: 'app-approval-refund-deposit-ipd',
  templateUrl: './approval-refund-deposit-ipd.component.html',
  styleUrls: ['./approval-refund-deposit-ipd.component.scss']
})
export class ApprovalRefundDepositIpdComponent implements OnInit {
  loadPage: boolean = false
  progress: boolean = false
  searched: boolean = false
  progressExport: boolean = false

  refundTypeList = [
    {key:"deposit-ipd-refund", value: "Refund Deposit IPD"},
    {key:"prepaid-refund", value: "Refund Prepaid"}
  ]
  selectedRefundType = {key: '', value: ''}

  getApprovalRefundRequestResponse!: GetApprovalRefundRequestResponse
  approvalRefundRequestList: ApprovalRefundRequest[] = []

  params: any
  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page?: number
  current_page = 1

  constructor() { }

  ngOnInit(): void {
  }

  onChangeRefundType(e: any){
    this.selectedRefundType = e
  }

  onChangePatientName(e: any){}

  onChangeMrNo(e: any){}

  onChangeRefundId(e: any){}

  onChangeRefundBy(e: any){}

  onChangePaymentMode(e: any){}

  onChangeRefundDate(e: any){}

  onChangeBookingId(e: any){}

  searchRefundRequest(){
    this.searched = true
  }

  onReset(){}

  navigateToDetailRefundRequest(){}

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.current_page = event.page
  }

  exportRefundRequest(){}

}