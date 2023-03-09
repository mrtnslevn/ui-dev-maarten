import { Component, OnInit } from '@angular/core';
import {HttpParams} from "@angular/common/http";
import {ALERT_DANGER, RESPONSE_SUCCESS} from "../../../_configs/app-config";
import {Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {GeneralService} from "../../../service/general.service";
import {InterfaceLogService} from "../../../service/interface-log";
import {GetInterfaceLogListResponse} from "../../../general/models/response/GetInterfaceLogListResponse";
import {InterfaceLogList} from "../../../general/models/InterfaceLogList";
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { Paging } from 'src/app/general/models/Paging';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { ComboBox } from 'src/app/general/models/ComboBox';
import { InterfaceLogSearchParam } from 'src/app/general/models/search-param/InterfaceLogSearchParam';

@Component({
  selector: 'app-interface-log',
  templateUrl: './interface-log.component.html',
  styleUrls: ['./interface-log.component.scss']
})
export class InterfaceLogComponent implements OnInit {

  loadPage: boolean = false
  getListResponse!: GetListResponse
  defaultInterfaceType: ComboBox = ComboBox.defaultAll()
  interfaceType: ComboBox[] = [this.defaultInterfaceType]
  defaultStatus: ComboBox = ComboBox.defaultAll()
  interfaceStatus: ComboBox[] = [this.defaultStatus]

  progress: boolean = false;
  listResponse!: GetInterfaceLogListResponse;
  interfaceList: InterfaceLogList[] = [];

  
  interface_type: ComboBox = this.defaultInterfaceType;
  process_date_start: string = "";
  process_date_end: string = "";
  status: ComboBox = this.defaultStatus;

  params: HttpParams = new HttpParams()
  bsModalShowAlert?: BsModalRef

  paging: Paging = new Paging(0, 0, 0, 0, 0)
  page?: number
  current_page: number = 0
  searched: boolean = false

  constructor(
    private interfaceLogService: InterfaceLogService, private router: Router,
    public bsModalService : BsModalService, private generalService: GeneralService,
    private alertService: ModalAlertService) { }

  ngOnInit(): void {
    this.getList()
    this.params = new HttpParams()
    .set('page_no', 1);
  }

  getList(){
    this.loadPage = true
    const params = new HttpParams()
    .set('param_list', 'interfaceTypeList')
    .append('param_list', 'interfaceLogStatusList')

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS) {
          this.getListResponse.interfaceTypeList.forEach(i => {
            this.interfaceType.push(i)
          })
          this.getListResponse.interfaceLogStatusList.forEach(i => {
            this.interfaceStatus.push(i)
          })
          this.getSearchParams()
        } else {
          this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
        }
        this.loadPage = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
        this.loadPage = false
      });
  }

  getSearchParams() {
    // get search params and search invoice list
    if (history.state.fromDetail) {
      let params: string = window.sessionStorage.getItem(InterfaceLogSearchParam.PARAM_KEY)!
      let searchParams: InterfaceLogSearchParam = JSON.parse(params)

      let interfaceType = this.interfaceType.find(i => i.key == searchParams.interface_type.key)
      let status = this.interfaceStatus.find(i => i.key == searchParams.status.key)

      this.onChangeInterfaceType(interfaceType)
      this.onChangeProcessDateStart(searchParams.process_date_start)
      this.onChangeProcessDateEnd(searchParams.process_date_end)
      this.onChangeStatus(status)

      this.pageChanged({page: searchParams.page_no, itemsPerPage: 0})
    } else {
      window.sessionStorage.removeItem(InterfaceLogSearchParam.PARAM_KEY)
    }
  }

  saveSearchParams() {
    let searchBody: InterfaceLogSearchParam = {
      interface_type: this.interface_type,
      process_date_start: this.process_date_start,
      process_date_end: this.process_date_end,
      status: this.status,
      page_no: this.current_page
    }
    
    window.sessionStorage.setItem(InterfaceLogSearchParam.PARAM_KEY, JSON.stringify(searchBody));
  }

  onReset() {
    this.interface_type = this.defaultInterfaceType
    this.process_date_start = ""
    this.process_date_end = ""
    this.status = this.defaultStatus
    this.params = new HttpParams().set('page_no',1)
  }

  searchInterfaceLog() {
    this.paging = new Paging(0, 0, 0, 0, 0)
    this.pageChanged({page: 1, itemsPerPage: 0})
  }

  getAll(event?: PageChangedEvent){
    this.saveSearchParams()
    
    this.progress = true;

    return this.interfaceLogService.getAll(this.params)
      .subscribe((data: GetInterfaceLogListResponse)=>
      {
        this.listResponse = {...data}
        if(this.listResponse.response_code === RESPONSE_SUCCESS){
          this.interfaceList = this.listResponse.interface_log_list;
          PropertyCopier.copyProperties(this.listResponse.paging, this.paging)
          if (event != undefined) this.page = event.page
          this.progress = false;
        }else{
          this.progress = false;
          this.alertService.showModalAlert(`Failed to get interface-log: ${this.listResponse.response_desc}`,ALERT_DANGER)
        }
        this.searched = true
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get interface-log, please contact administration`, ALERT_DANGER)
        this.progress = false
        this.searched = true
      });
  }

  navigateToDetails(interfaceLog: InterfaceLogList): void {
    this.router.navigate(['interface-log/detail', interfaceLog.log_id]);
  }

  onChangeInterfaceType(selected: any){
    this.interface_type = selected;
    this.params = this.params.set('interface_type', selected.key)
  }

  onChangeStatus(selected: any){
    this.status = selected;
    this.params = this.params.set('status', selected.key)
  }

  onChangeProcessDateStart(selected: string){
    this.process_date_start = selected;
    if (selected != null) this.params = this.params.set('process_date_start', selected)
    else this.params = this.params.delete('process_date_start')
  }

  onChangeProcessDateEnd(selected: string){
    this.process_date_end = selected;
    if (selected != null) this.params = this.params.set('process_date_end', selected)
    else this.params = this.params.delete('process_date_end')
  }

  pageChanged(event: PageChangedEvent) {
    this.params = this.params.set("page_no", event.page);
    this.current_page = event.page
    this.getAll(event);
  }

}
