import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BsModalRef} from 'ngx-bootstrap/modal';
import { ModalSendPrintDepositFormsService } from './modal-send-print-deposit-forms.service';

@Component({
  selector: 'app-modal-send-print-deposit',
  templateUrl: './modal-send-print-deposit.component.html',
  styleUrls: ['./modal-send-print-deposit.component.scss']
})
export class ModalSendPrintDepositComponent implements OnInit {

  @Input() whatsapp: string = ''
  @Input() email: string = ''
  @Input() type: string = ''
  @Input() printOriManyTimes: boolean = false
  @Input() onLoad:boolean = false

  @Output() onPrintReceipt :any
  @Output() onSendReceipt :any


  action:string='print'

  constructor(
    public bsModalRef:BsModalRef,
    public fs:ModalSendPrintDepositFormsService,
  ) { 
    this.fs.component = this
  }

  ngOnInit(): void {
    this.fs.createForm();
    this.fs.controls["action"].setValue("print");
    this.disableForm()
  }
  disableForm(){
    if (this.action == "send") {
      this.fs.controls["email"].enable();
    } else {
      this.fs.controls["email"].disable();
    }
  }
  onChangeAction(action: any) {
    this.action = action;
    this.disableForm()
  }
  onChangeWhatsapp(whatsapp: string) {
    this.whatsapp = whatsapp
  }

  onChangeEmail(email: string) {
    this.email = email
  }
  onValidatePrintSendReport() {
    this.fs.submitted = true;
    if (this.fs.valid) this.printSendReport();
  }
  printSendReport(){
    console.log(this.onPrintReceipt)
    switch (this.action) {
      case "print":
        this.onPrintReceipt({type : this.type, email : this.email, whatsapp : this.whatsapp});
        break;
      case "send":
        this.onSendReceipt({type : this.type, email : this.email, whatsapp : this.whatsapp});
        break;
    } 
  }

}
