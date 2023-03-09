import { Injectable } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalAlertConfirmComponent } from '../general/general-modal/modal-alert-confirm/modal-alert-confirm.component';
import { ModalAlertComponent } from '../general/general-modal/modal-alert/modal-alert.component';
import { ALERT_DANGER, ALERT_SUCCESS } from '../_configs/app-config';
import { ModalDefaultConfig } from '../_configs/modal-config';

@Injectable({
  providedIn: 'root'
})
export class ModalAlertService {

  bsModalShowAlert?: BsModalRef
  bsModalShowAlertConfirm?: BsModalRef
  
  constructor(private bsModalService : BsModalService) { }

  showModalAlert(message: string, type: string){
   const initialState: ModalOptions = {
     initialState: {
       message: message,
       type: type
     },
   };
   this.bsModalShowAlert = this.bsModalService.show(ModalAlertComponent, Object.assign(ModalDefaultConfig, initialState))
 }

 showModalAlertError(message: string) {
  const initialState: ModalOptions = {
    initialState: {
      message: message,
      type: ALERT_DANGER
    },
  };
  this.bsModalShowAlert = this.bsModalService.show(ModalAlertComponent, Object.assign(ModalDefaultConfig, initialState))
 }

 showModalAlertSuccess(message: string) {
  const initialState: ModalOptions = {
    initialState: {
      message: message,
      type: ALERT_SUCCESS
    },
  };
  this.bsModalShowAlert = this.bsModalService.show(ModalAlertComponent, Object.assign(ModalDefaultConfig, initialState))
 }

 showModalConfirm(message: string): BsModalRef {
  const initialState: ModalOptions = {
    initialState: {
      message: message,
    },
  };
  this.bsModalShowAlertConfirm = this.bsModalService.show(ModalAlertConfirmComponent, Object.assign(ModalDefaultConfig, initialState))
  return this.bsModalShowAlertConfirm
}

}
