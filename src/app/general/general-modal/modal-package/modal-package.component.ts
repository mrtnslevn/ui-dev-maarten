import { HttpParams } from '@angular/common/http';
import { Component, Input, OnInit, Output, EventEmitter, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { BookingPaymentService } from 'src/app/service/booking-payment.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { Pagination } from 'src/app/_helpers/pagination';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { Package } from '../../models/Package';
import { Paging } from '../../models/Paging';

@Component({
  selector: 'app-modal-package',
  templateUrl: './modal-package.component.html',
  styleUrls: ['./modal-package.component.scss']
})
export class ModalPackageComponent implements OnInit {
  @Output() selectPackageEvent = new EventEmitter<Package>();
  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent
  
  package_name: string = ''
  package_code: string = ''
  current_page: number = 0
  page?: number = 0

  hospital_id: string = ''
  mobile_org_id: string = ''

  getMcuPackageResponse: any
  getCovidPackageResponse: any

  data: Package[] = []
  listPackage: any
  listMcuPackage: any
  listCovidPackage: any
  paging: Paging = new Paging(0, 0, 0, 0, 0)

  loadButton: boolean = false
  loadData: boolean = false
  progress: boolean = false

  params = new HttpParams()

  @Input() typePackage: string = ''

  bsModalShowAlert?: BsModalRef

  constructor(public bsModalRef: BsModalRef, private bookingPaymentService: BookingPaymentService,
    private token: TokenStorageService, private bsModalService : BsModalService, private alertService: ModalAlertService) { }

  ngOnInit(): void {
    const userData = this.token.getUserData();
    this.hospital_id = userData.mobile_organization_id;

    this.params = this.params.set('page_no',1)
  }
  
  onChangePackageName(e: string){
    this.package_name = e
    if(this.typePackage=='mcu'){
      this.params = this.params.set('q',this.package_name)
    }else{
      this.params = this.params.set('package_name',this.package_name)
    }
  }

  onReset(){
    this.package_name = ""
    this.params = new HttpParams().set('page_no',1)
  }

  onSearchPackage(){
    this.loadButton = true

    if(this.typePackage=='mcu'){
      this.getMcuPackageList()
    }else{
      this.getCovidPackageList()
    }
  }

  getMcuPackageList(event?: PageChangedEvent){
    this.progress = true
    this.params = this.params.set('hospital',this.hospital_id)

    return this.bookingPaymentService.getMcuPackage(this.params)
    .subscribe((data)=>
    {
      this.getMcuPackageResponse = {...data};
      if(this.getMcuPackageResponse.response_code === RESPONSE_SUCCESS) {
        this.data = this.getMcuPackageResponse.sales_item_list;
        this.paging = PropertyCopier.clone(this.getMcuPackageResponse.paging, this.paging);
        if (event != undefined) this.page = event.page;
        else if (this.paginationComp != undefined) {
          Pagination.setPaginationComp(this.paging, this.paginationComp)
        }
        this.loadButton = false
      } else {
        this.alertService.showModalAlert(`Failed to get mcu package list: ${this.getMcuPackageResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadButton = false
      this.progress = false
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get mcu package list, please contact administration`, ALERT_DANGER)
      this.progress = false
      this.loadButton = false
    });
  }

  getCovidPackageList(event?: PageChangedEvent){
    this.progress = true
    this.params = this.params.set('hospital_id',this.hospital_id)

    return this.bookingPaymentService.getCovidPackage(this.params)
    .subscribe((data)=>
    {
      this.getCovidPackageResponse = {...data};
      if(this.getCovidPackageResponse.response_code === RESPONSE_SUCCESS) {
        this.data = this.getCovidPackageResponse.sales_item_list;
        this.paging = PropertyCopier.clone(this.getCovidPackageResponse.paging, this.paging);
        if (event != undefined) this.page = event.page;
        else if (this.paginationComp != undefined) {
          Pagination.setPaginationComp(this.paging, this.paginationComp)
        }
      } else {
        this.alertService.showModalAlert(`Failed to get covid package list: ${this.getCovidPackageResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadData = false
      this.loadButton = false
      this.progress = false
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get covid package list, please contact administration`, ALERT_DANGER)
      this.loadData = false
      this.loadButton = false
      this.progress = false
    });
  }

  onSelectedPackage(d: Package){
    this.selectPackageEvent.emit(d);
    this.bsModalRef.hide();
  }

  pageChanged(event: PageChangedEvent){
    this.params = this.params.set("page_no", event.page);
    if(this.typePackage=='mcu'){
      this.getMcuPackageList(event)
    }else{
      this.getCovidPackageList(event)
    }
  }

}
