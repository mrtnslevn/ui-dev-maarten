import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { Pagination } from 'src/app/_helpers/pagination';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { Paging } from '../../models/Paging';
import { GetPayerListResponse } from '../../models/response/GetPayerListResponse';

@Component({
  selector: 'app-modal-search-payer',
  templateUrl: './modal-search-payer.component.html',
  styleUrls: ['./modal-search-payer.component.scss']
})
export class ModalSearchPayerComponent implements OnInit {

  @Output() newItemEvent = new EventEmitter<any>();
  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent

  getPayerListResponse: GetPayerListResponse | undefined;
  total_row : number = 0;
  current_page = 1;
  page?: number;
  itemPerPage = 0;
  paging: Paging = new Paging(0, 0, 0, 0, 0);
  progress: boolean = false;

  data: any = []
  params = new HttpParams()
  payerName: string = '';
  search: boolean = false;

  bsModalShowAlert?: BsModalRef

  constructor(public bsModalRef: BsModalRef, private generalService: GeneralService,
    private alertService: ModalAlertService) { }

  ngOnInit(): void {
    this.params = new HttpParams()
    .set('page_no',1);
  }

  searchPayer() {
    this.paging = new Paging(0, 0, 0, 0, 0)
    this.pageChanged({page: 1, itemsPerPage: 0})
  }

  showData(event?: PageChangedEvent){
    this.progress = true;
    this.generalService.getPayerList(this.params)
    .subscribe((data: GetPayerListResponse) => {
        this.getPayerListResponse = {...data};
        if (this.getPayerListResponse.response_code == RESPONSE_SUCCESS) {
          this.data = this.getPayerListResponse.payer_list;
          // this.total_row = this.getPayerListResponse.paging.total_row;
          // this.itemPerPage = this.getPayerListResponse.paging.rows_per_page;
          this.paging = PropertyCopier.clone(this.getPayerListResponse.paging, this.paging);
          if (event != undefined) this.page = event.page;
          this.search = true;
        } else {
          this.alertService.showModalAlert(`Failed to get payer list: ${this.getPayerListResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get payer list, please contact administration`, ALERT_DANGER)
      this.progress = false;
    })
  }

  sendData(value: any) {
    this.newItemEvent.emit(value);
    this.bsModalRef.hide();
  }

  onChangePayerName(e: any){
    this.payerName = e
    this.params = this.params.set('payer_name', this.payerName)
  }

  onReset(){
    this.payerName = ""
    this.params = new HttpParams().set('page_no',1)
  }

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.showData(event);
  }

}
