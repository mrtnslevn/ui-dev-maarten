import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { DepositIpdService } from 'src/app/service/deposit-ipd.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { DepositIpdHistory } from 'src/app/views/deposit-ipd/models/DepositIpdHistory.model'; 
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER } from 'src/app/_configs/app-config';
import { Paging } from '../../models/Paging';
import { RefundDeposit } from '../../models/RefundDeposit';
import { RefundDepositIpd } from '../../models/RefundDepositIpd';

@Component({
  selector: 'app-card-deposit-ipd-history',
  templateUrl: './card-deposit-ipd-history.component.html',
  styleUrls: ['./card-deposit-ipd-history.component.scss']
})
export class CardDepositIpdHistoryComponent implements OnInit {
  @Input() title: string = ''
  @Input() depositHistoryList: DepositIpdHistory[] = []
  @Input() hide: string[] = []
  @Input() onLoad : boolean = false
  @Input() showNavigateButton:boolean = false
  @Input() onLoadExport : boolean = false
  @Output() onChangePage = new EventEmitter()
  @Output() onExport = new EventEmitter()
  @Input() patientInfo: RefundDepositIpd = RefundDepositIpd.default()
  @Input() admissionNo: string = ''

  total_row: number = 0
  itemPerPage: number = 0;
  current_page: number = 1;
  page?: number;
  paging: Paging = new Paging(0, 0, 0, 0, 0);
  progress: boolean = false

  progressExport: boolean = false
  orgId: number = 0

  constructor(
    private router: Router,
    private token: TokenStorageService,
    private depositService: DepositIpdService,
    private alertService: ModalAlertService,
  ) {

  }

  ngOnInit(): void {
    const userData = this.token.getUserData();
    this.orgId = userData.hope_organization_id;
  }

  onChangePagination(){
    this.onChangePage.emit()
  }

  onClickExport(){
    this.onExport.emit()
  }

  navigateToDetails(transactionNo: string | undefined) {
    if(!transactionNo) return
    this.router.navigate(['deposit-ipd/deposit-ipd-transaction-detail', transactionNo])
  }


  exportDepositIpdHistory(){
    this.progressExport = true
    const params = new HttpParams()
    .set('mr_no', this.patientInfo.mr_no)
    .set('admission_no',this.admissionNo)
    .set('org_id', this.orgId)
    .set('export_file_type','EXCEL')

    return this.depositService.exportDepositIpdHistory(params).subscribe(data => {
      if(data.headers.get("response_code")!="00"){
        this.alertService.showModalAlert(`Failed to export file: ${data.headers.get("response_desc")}`, ALERT_DANGER)  
        this.progressExport = false
      }else{
        let blob = data.body as Blob;
        let filename: string = data.headers.get("content-disposition").split(";")[1].split("=")[1].replace(/"/g, '');
        var downloadUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        a.click();
        this.progressExport = false
      }
    },err => {
      this.progressExport = false
      this.alertService.showModalAlert(`An error has occured while export refund prepaid list, please contact administration`, ALERT_DANGER)
    })
  }

  // pageChanged(event: PageChangedEvent): void {
  //   this._params = this._params.set("page_no", event.page);
  //   this.getPaymentSettlement(event);
  // }
}
