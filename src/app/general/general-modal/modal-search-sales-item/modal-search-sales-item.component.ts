import { HttpParams } from '@angular/common/http';
import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PaymentService } from 'src/app/service/payment.service';
import { RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { GetSalesItemListResponse, ItemList } from '../../models/response/GetSalesItemListResponse';
import { Paging } from '../../models/Paging';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { ComboBox } from '../../models/ComboBox';
import { ModalAlertService } from 'src/app/service/modal-alert.service';

@Component({
    selector: 'app-modal-search-sales-item',
    templateUrl: './modal-search-sales-item.component.html',
    styleUrls: ['./modal-search-sales-item.component.scss']
  })

 export class ModalSearchSalesItemComponent implements OnInit {

    @Input() lob: number = 0;
    // @Input() salesItemType: SalesItemType = SalesItemType.default();
    @Input() salesItemCategory: ComboBox = ComboBox.default()
    @Input() store: any;
    @Output() selectedItem = new EventEmitter<ItemList>();

    salesItemName: string = '';
    salesItemCode: string = '';
    progress: boolean = false;
    search: boolean = false;

    getSalesItemListResponse: GetSalesItemListResponse | undefined;
    total_row: number = 0
    itemPerPage: number = 0;
    current_page: number = 1;
    page?: number;
    paging: Paging = new Paging(0, 0, 0, 0, 0);
  
    data: ItemList[] = []
    params = new HttpParams();
    constructor(private paymentService: PaymentService, public bsModalRef: BsModalRef,
      private alertService: ModalAlertService) { }
  
    ngOnInit(): void {
      this.params = this.params.set("page_no", 1);
    }

    searchSalesItem() {
      this.paging = new Paging(0, 0, 0, 0, 0)
      this.pageChanged({page: 1, itemsPerPage: 0})
    }
  
    getDataSalesItem(event?: PageChangedEvent){
      this.progress = true;
      if (this.lob > 0) {
        this.params = this.params.set("lob_id", this.lob);
      }
      // if (this.salesItemType != null && this.salesItemType.sales_item_type_id > 0) {
      //   this.params = this.params.set("sales_item_type_id",6);
      // }
      if (this.salesItemCategory != null && this.salesItemCategory.key != "") {
        this.params = this.params.set("sales_item_category_id", this.salesItemCategory.key)
      }
      if (this.store != null && this.store.store_id != 0) {
        this.params = this.params.set("store_id", this.store.store_id);
      }
      return this.paymentService.getSalesItem(this.params)
        .subscribe((data)=>
        {
          this.getSalesItemListResponse = {...data};
          if(this.getSalesItemListResponse?.response_code == RESPONSE_SUCCESS) {
            this.data = this.getSalesItemListResponse.sales_item_list;
            PropertyCopier.copyProperties(this.getSalesItemListResponse.paging, this.paging);
            if (event != undefined) this.page = event.page
          } else {
            this.alertService.showModalAlertError(`Failed to get sales item list with error: ${this.getSalesItemListResponse?.response_desc}`)
          }
          
          this.progress = false;
          this.search = true;

          if (event != undefined) this.page = event.page;
        }, err => {
          if (this.getSalesItemListResponse?.response_desc != undefined) {
            this.alertService.showModalAlertError(`Failed to get sales item list with error: ${this.getSalesItemListResponse.response_desc}`)
          } else {
            this.alertService.showModalAlertError(`Failed to get sales item list, please contact administration`)
          }
          this.progress = false;
        });
    }
    selectItem(item: ItemList){
      this.selectedItem.emit(item);
      this.bsModalRef.hide();
    }

    onChangeSalesItemName(e: any){
      this.salesItemName = e;
      this.params = this.params.set('sales_item_name', this.salesItemName)
    }

    onChangeSalesItemCode(e: any){
      this.salesItemCode = e;
      this.params = this.params.set('sales_item_code', this.salesItemCode)
    }

    onReset(){
      this.salesItemCode = ""
      this.salesItemName = ""
      this.params = new HttpParams().set("page_no", 1);
    }

    pageChanged(event: PageChangedEvent) {
      this.params = this.params.set("page_no", event.page);
      this.current_page = event.page
      this.getDataSalesItem(event);
    }
 }