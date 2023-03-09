import { ModalAlertService } from './../../../service/modal-alert.service';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { AdditionalDiscount } from 'src/app/general/models/Additional_Discount';
import { Paging } from '../../models/Paging';
import { HttpParams } from '@angular/common/http';
import { InvoiceInquiryService } from 'src/app/service/invoice-inquiry.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { GetCustomAdditionalDiscountResponse } from '../../models/response/GetCustomAdditionalDiscountResponse';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { Pagination } from 'src/app/_helpers/pagination';

@Component({
  selector: 'app-modal-custom-additional-discount',
  templateUrl: './modal-custom-additional-discount.component.html',
  styleUrls: ['./modal-custom-additional-discount.component.scss']
})
export class ModalCustomAdditionalDiscountComponent implements OnInit { 

  @ViewChild (PaginationComponent) paginationComp!: PaginationComponent
  @Input() invoice_no: string = ""

  data?: AdditionalDiscount[] = [{
    disc_factor: 0,
    disc_type_id: 0,
    disc_type_name: '',
    notes: '',
    ordered_item_id: 0,
    ordered_item_name: '',
    portion_type_id: 0,
    portion_type_name: '',
    sales_item_group_id: 0,
    sales_item_group_name: '',
    sales_item_type_id: 0,
    sales_item_type_name: '',
    sales_item_id: 0,
    sales_item_name: '',
    transaction_level_id: 0,
    transaction_level_name: '',
  }]

  loadPage:boolean = true

  title? : String;

  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page?: number
  current_page = 1
  params: any
  progress: boolean = false;

  getCustomAddDiscountResponse!: GetCustomAdditionalDiscountResponse

  constructor(public bsModalRef: BsModalRef, public invoiceInquiryService: InvoiceInquiryService,
     private alertService: ModalAlertService,) { }

  ngOnInit(): void {
    this.params = new HttpParams().set('invoice_no', this.invoice_no)
    this.getList()
  }

  getList(event?: PageChangedEvent){
    this.invoiceInquiryService.getCustomAddDiscount(this.params).subscribe((data: GetCustomAdditionalDiscountResponse) => {
      this.getCustomAddDiscountResponse = {...data}
      if(this.getCustomAddDiscountResponse.response_code === RESPONSE_SUCCESS){
        this.data = data.custom_add_discount_list
        PropertyCopier.copyProperties(this.getCustomAddDiscountResponse.paging, this.paging);
  
        if (event != undefined) this.page = event.page;
        else if (this.paginationComp != undefined) {
          Pagination.setPaginationComp(this.paging, this.paginationComp)
        }
      }else{
        this.alertService.showModalAlert(`Failed to get list: ${this.getCustomAddDiscountResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadPage = false
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get custom additional discount data, please contact administration`, ALERT_DANGER)
      this.loadPage = false;
    })
  }

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.getList(event)
  }

}
