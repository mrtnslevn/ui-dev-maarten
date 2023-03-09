import { Component, Input, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-modal-alert',
  templateUrl: './modal-alert.component.html',
  styleUrls: ['./modal-alert.component.scss']
})
export class ModalAlertComponent implements OnInit {

  @Input() message: string = ''
  @Input() type: string = ''
  @Input() isLogout?: boolean = false
  constructor(public bsModalRef: BsModalRef) { }

  ngOnInit(): void {
  }

}
