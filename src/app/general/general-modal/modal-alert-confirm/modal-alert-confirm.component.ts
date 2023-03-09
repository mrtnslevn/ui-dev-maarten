import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-alert-confirm',
  templateUrl: './modal-alert-confirm.component.html',
  styleUrls: ['./modal-alert-confirm.component.scss']
})
export class ModalAlertConfirmComponent implements OnInit {

  constructor(public bsModalRef: BsModalRef) { }
  message: string = ''
  @Output() isConfirm = new EventEmitter<any>();

  ngOnInit(): void {
  }

  onOk(){
    this.isConfirm.emit(true)
    this.bsModalRef.hide()
  }

}
