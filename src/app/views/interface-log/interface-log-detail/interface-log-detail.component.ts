import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {GeneralService} from "../../../service/general.service";
import {HttpParams} from "@angular/common/http";
import {ALERT_DANGER, ALERT_SUCCESS, RESPONSE_SUCCESS} from "../../../_configs/app-config";
import {InterfaceLogService} from "../../../service/interface-log";
import {GetInterfaceLogDetailResponse} from "../../../general/models/response/GetInterfaceLogDetailResponse";
import { ModalAlertService } from 'src/app/service/modal-alert.service';

@Component({
  selector: 'app-interface-log-detail',
  templateUrl: './interface-log-detail.component.html',
  styleUrls: ['./interface-log-detail.component.scss']
})
export class InterfaceLogDetailComponent implements OnInit {

  getParams: any;
  response: any = {};
  loadPage: boolean = false
  loadReprocessButton: boolean = false

  interfaceLog: GetInterfaceLogDetailResponse = GetInterfaceLogDetailResponse.default()

  reprocessResponse: any
  bsModalShowAlert?: BsModalRef

  constructor(private interfaceLogService: InterfaceLogService, private router: Router,
    public bsModalService : BsModalService, private generalService: GeneralService, private route: ActivatedRoute,
    private alertService: ModalAlertService) { }

  ngOnInit(): void {
    this.getParams = this.route.params.subscribe(params => {
      this.getDetail(params['log_id']);
    })
  }

  getDetail(log_id: string) {
    this.loadPage = true
    const params = new HttpParams()
      .set("log_id", log_id);

    return this.interfaceLogService.getDetail(params)
      .subscribe((data: GetInterfaceLogDetailResponse)=>
      {
        this.response = {...data}
        if(this.response.response_code === RESPONSE_SUCCESS){
          this.interfaceLog = {
            batch_id: this.response.batch_id,
            org_id: this.response.org_id,
            log_id: this.response.log_id,
            interface_type: this.response.interface_type,
            process_date: this.response.process_date,
            status: this.response.status,
            endpoint: this.response.endpoint,
            request_time: this.response.request_time,
            request_message: this.response.request_message,
            response_message: this.response.response_message,
            transaction_type: this.response.transaction_type
          };
          this.loadPage = false
        }else{
          this.alertService.showModalAlert(`Failed to retrieve data: ${this.response.response_desc}`,ALERT_DANGER)
          this.loadPage = false
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while retrieve data, please contact administration`, ALERT_DANGER)
        this.loadPage = false
      });
  }

  // navigateToHome(): void {
  //   this.router.navigate(['interface-log'])
  // }

  onClickReprocess(){
    this.loadReprocessButton = true

    const body = {
      log_id: this.interfaceLog.log_id,
      org_id: this.interfaceLog.org_id,
      batch_id: this.interfaceLog.batch_id,
      transaction_type: this.interfaceLog.transaction_type
    }

    return this.interfaceLogService.retryService(body)
    .subscribe((data: GetInterfaceLogDetailResponse)=>
    {
      this.reprocessResponse = {...data}
      if(this.reprocessResponse.response_code === RESPONSE_SUCCESS){
        this.alertService.showModalAlert("Reprocess success",ALERT_SUCCESS)
        this.loadReprocessButton = false
      }else{
        this.alertService.showModalAlert(`Failed to reprocess data: ${this.reprocessResponse.response_desc}`,ALERT_DANGER)
        this.loadReprocessButton = false
      }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while reprocess data, please contact administration`, ALERT_DANGER)
      this.loadReprocessButton = false
    });
  }

}
