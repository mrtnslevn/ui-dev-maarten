import { Component, Input, OnInit, Output } from '@angular/core';
import { BsModalRef} from 'ngx-bootstrap/modal';
import { BookingPaymentService } from 'src/app/service/booking-payment.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { PaymentService } from 'src/app/service/payment.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, ALERT_INFO, ALERT_SUCCESS, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { BookingInformation } from '../../models/BookingInformation';
import { Invoice } from '../../models/Invoice';
import { OrderedItem } from '../../models/OrderedItem';
import { OrderedItemType } from '../../models/OrderedItemType';
import { Patient } from '../../models/Patient';
import { PrintTemporaryInvoiceAdmission, PrintTemporaryInvoiceData, PrintTemporaryInvoiceOrderedItem, PrintTemporaryInvoiceRequest } from '../../models/request/PrintTemporaryInvoiceReq';
import { PrintTemporaryPrepaidRequest } from '../../models/request/PrintTemporaryPrepaidReq';
import { SendInvoiceRequest } from '../../models/request/SendInvoiceReq';
import { SendPrepaidRequest } from '../../models/request/SendPrepaidReq';
import { SendTemporaryInvoiceRequest } from '../../models/request/SendTemporaryInvoiceReq';
import { SendTemporaryPrepaidRequest } from '../../models/request/SendTemporaryPrepaidReq';
import { SendInvoiceResponse } from '../../models/response/SendInvoiceResponse';
import { SendPrepaidResponse } from '../../models/response/SendPrepaidResponse';
import { SendTemporaryInvoiceResponse } from '../../models/response/SendTemporaryInvoiceResponse';
import { SendTemporaryPrepaidResponse } from '../../models/response/SendTemporaryPrepaidResponse';
import { ModalSendPrintFormsService } from './modal-send-print-forms.service';

@Component({
  selector: 'app-modal-send-print',
  templateUrl: './modal-send-print.component.html',
  styleUrls: ['./modal-send-print.component.scss']
})
export class ModalSendPrintComponent implements OnInit {

  @Input() whatsapp: string = ''
  @Input() email: string = ''
  @Input() type: string = ''
  @Input() id: string = ''
  @Input() print_type: string = ''
  @Input() prepaid_list: BookingInformation[] = []
  @Input() nationality_id: number = 0
  @Input() discount: number = 0

  @Input() patientInfo: Patient = Patient.default()
  @Input() invoice: Invoice = Invoice.default()
  @Input() orderedItemList: OrderedItemType[] = []

  @Input() modalType: string = '';

  @Output() prepaid_id: string = ''

  @Input() printOriManyTimes: boolean = false

  action: string = '';
  progress: boolean = false;

  userData: any

  bsModalShowAlert?: BsModalRef

  sendInvoiceResponse!: SendInvoiceResponse;
  sendTemporaryInvoiceResponse!: SendTemporaryInvoiceResponse;
  sendPrepaidResponse!: SendPrepaidResponse;
  sendTemporaryPrepaidResponse!: SendTemporaryPrepaidResponse;

  constructor(public bsModalRef: BsModalRef, private bookingPaymentService: BookingPaymentService,
    private paymentService: PaymentService, private alertService: ModalAlertService,
    public fs: ModalSendPrintFormsService,
    private token: TokenStorageService) { 
      this.fs.component = this
  }

  ngOnInit(): void {
    this.fs.createForm();
    this.userData = this.token.getUserData();
    this.fs.controls["action"].setValue("print");
  }

  onChangeAction(action: any) {
    this.action = action;
    if (action == "send") {
      // this.fs.controls["whatsapp"].enable();
      this.fs.controls["email"].enable();
    } else {
      // this.fs.controls["whatsapp"].disable();
      this.fs.controls["email"].disable();
    }
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
    switch (this.action) {
      case "print":
        this.printReport();
        break;
      case "send":
        this.sendReport();
        break;
    } 
  }

  printReport() {
    switch (this.type) {
      case "payment":
        if (this.print_type == "sementara") {
          this.printTemporaryReportPayment();
          break;
        }
        this.printReportPayment();
        break;
      case "prepaid":
        if (this.print_type == "sementara") {
          this.printTemporaryReportPrepaid();
          break;
        }
        this.printReportPrepaid();
        break;
    }
  }

  sendReport() {
    switch (this.type) {
      case "payment":
        if (this.print_type == "sementara") {
          this.sendTemporaryReportPayment();
          break;
        }
        this.sendReportPayment();
        break;
      case "prepaid":
        if (this.print_type == "sementara") {
          this.sendTemporaryPrepaid();
          break;
        }
        this.sendReportPrepaid();
        break;
    }
  }

  printReportPayment() {
    this.progress = true;
    const body: any = {
      invoice_no: this.id,
      invoice_type: this.modalType,
      print_ori_many_times: this.printOriManyTimes,
      notes: this.patientInfo.notes,
    }

    this.paymentService.printInvoice(body).subscribe(data => {
      if(data.headers.get("response_code")!="00"){
        this.alertService.showModalAlert(`Failed to print report: ${data.headers.get("response_desc")}`, ALERT_DANGER)  
      }else{
        let blob = data.body as Blob;
        let downloadUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
  
        a.href = downloadUrl;
        a.target = "_blank";
        a.click();
      }
      this.progress = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while print report payment, please contact administration`, ALERT_DANGER)
      this.progress = false;
    })
  }

  printTemporaryReportPayment() {
    this.progress = true;

    const req: PrintTemporaryInvoiceRequest = this.createTemporaryReportPaymentRequest()

    this.paymentService.printTemporaryInvoice(req).subscribe((data) => {
      if(data.headers.get("response_code")!="00"){
        this.alertService.showModalAlert(`Failed to print temporary report: ${data.headers.get("response_desc")}`, ALERT_DANGER)  
      }else{
        let blob = data.body as Blob;
        let downloadUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
  
        a.href = downloadUrl;
        a.target = "_blank";
        a.click();
      }
      this.progress = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while print temporary report payment, please contact administration`, ALERT_DANGER)
      this.progress = false;
    })
  }

  sendReportPayment() {
    this.progress = true;
    const body: SendInvoiceRequest = {
      invoice_no: this.id,
      invoice_type: this.modalType,
      whatsapp: '',
      email: this.email,
      notes: this.patientInfo.notes!,
    }

    this.paymentService.sendInvoice(body).subscribe((data: SendInvoiceResponse) => {
      this.sendInvoiceResponse = {...data}
      
      if (this.sendInvoiceResponse.response_code == RESPONSE_SUCCESS) {
        this.alertService.showModalAlert(`Report paymment is successfully sent`,ALERT_SUCCESS)
      }else{
        this.alertService.showModalAlert(`Failed to send report payment: ${this.sendInvoiceResponse.response_desc}`,ALERT_DANGER)
      }
      this.progress = false
    }, err => {
      this.alertService.showModalAlert(`An error has occured while send report payment, please contact administration`, ALERT_DANGER)
      this.progress = false
    })
  }

  sendTemporaryReportPayment() {
    this.progress = true;

    const baseReq: PrintTemporaryInvoiceRequest = this.createTemporaryReportPaymentRequest()

    const req: SendTemporaryInvoiceRequest = {
      admission: baseReq.admission,
      invoice: baseReq.invoice,
      whatsapp: '',
      email: this.email,
      nationality_id: this.patientInfo.nationality_id!,
      notes: this.patientInfo.notes!,
    }
    
    this.paymentService.sendTemporaryInvoice(req)
    .subscribe((data: SendTemporaryInvoiceResponse) => {
        this.sendTemporaryInvoiceResponse = {...data}
        if (this.sendTemporaryInvoiceResponse.response_code == RESPONSE_SUCCESS) {
          this.alertService.showModalAlert(`Temporary report paymment is successfully sent`,ALERT_SUCCESS)
        }else{
          this.alertService.showModalAlert(`Failed to send temporary report payment: ${this.sendTemporaryInvoiceResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while send temporary report payment, please contact administration`, ALERT_DANGER)
        this.progress = false
      })
  }
  
  printReportPrepaid(){
    this.progress = true;

    const params = {
      prepaid_id: this.id,
      invoice_type: this.modalType,
    }

    return this.bookingPaymentService.printPrepaid(params)
      .subscribe((data)=>
      {
        if(data.headers.get("response_code")!="00"){
          this.alertService.showModalAlert(`Failed to print report: ${data.headers.get("response_desc")}`, ALERT_DANGER)  
        }else{
          let blob = data.body as Blob;
          var downloadUrl = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          
          a.href = downloadUrl;
          a.target = "_blank";
          a.click();
        }
        this.progress = false;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while print report prepaid, please contact administration`, ALERT_DANGER)
        this.progress = false;
      });
  }

  printTemporaryReportPrepaid(){
    
    this.progress = true;
    const req: PrintTemporaryPrepaidRequest = {
      prepaid_list: this.prepaid_list,
      nationality_id: this.nationality_id,
      discount: this.discount,
    }

    return this.bookingPaymentService.printTemporaryPrepaid(req)
      .subscribe((data)=>
      {
        if(data.headers.get("response_code")!="00"){
          this.alertService.showModalAlert(`Failed to print temporarys report: ${data.headers.get("response_desc")}`, ALERT_DANGER)  
        }else{
          let blob = data.body as Blob;
          var downloadUrl = window.URL.createObjectURL(blob);
          let a = document.createElement('a');
          
          a.href = downloadUrl;
          a.target = "_blank";
          a.click();
        }
        this.progress = false;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while print temporary report prepaid, please contact administration`, ALERT_DANGER)
        this.progress = false;
      });
  }

  sendReportPrepaid() {
    this.progress = true;
    const req: SendPrepaidRequest = {
      prepaid_id: this.id,
      invoice_type: this.modalType,
      whatsapp: '',
      email: this.email
    }

    this.bookingPaymentService.sendPrepaid(req).subscribe((data: SendPrepaidResponse) => {
      this.sendPrepaidResponse = {...data}
      this.alertService.showModalAlert(`Report prepaid is successfully sent`,ALERT_SUCCESS)
      this.progress = false
    }, err => {
      this.alertService.showModalAlert(`An error has occured while send report prepaid, please contact administration`, ALERT_DANGER)
      this.progress = false
    })
  }

  sendTemporaryPrepaid() {
    this.progress = true;
    const req: SendTemporaryPrepaidRequest = {
      prepaid_list: this.prepaid_list,
      whatsapp: '',
      email: this.email,
      nationality_id: this.nationality_id,
      discount: this.discount
    }

    this.bookingPaymentService.sendTemporaryPrepaid(req)
    .subscribe((data: SendTemporaryPrepaidResponse) => {
      this.sendTemporaryPrepaidResponse = {...data}
      this.alertService.showModalAlert(`Temporary report prepaid is successfully sent`,ALERT_SUCCESS)
      this.progress = false
    }, err => {
      this.alertService.showModalAlert(`An error has occured while send temporary report prepaid, please contact administration`, ALERT_DANGER)
      this.progress = false
    })
  }

  createTemporaryReportPaymentRequest() {
    const admission = PrintTemporaryInvoiceAdmission.default();
    PropertyCopier.copyProperties(this.patientInfo, admission);
    admission.company_name = this.userData.oganization_name
    admission.npwp = this.userData.npwp

    const invoice = PrintTemporaryInvoiceData.default();
    PropertyCopier.copyProperties(this.invoice, invoice);

    this.orderedItemList.forEach((o: OrderedItemType) => {
      let item: PrintTemporaryInvoiceOrderedItem = PrintTemporaryInvoiceOrderedItem.default()
      item.sales_item_type_name = o.sales_item_type_name;
      o.sales_item_list.forEach((s: OrderedItem) => {
        PropertyCopier.copyProperties(s, item);
        item.description = s.doctor;
        invoice.ordered_item_list.push(item);
      })
    })

    const req: PrintTemporaryInvoiceRequest = {
      admission: admission,
      invoice: invoice,
      nationality_id: this.patientInfo.nationality_id!,
      notes: this.patientInfo.notes!,
    };
    return req;
  }
}
