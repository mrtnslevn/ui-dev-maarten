import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { PaymentService } from "../../../service/payment.service";
import { Invoice } from "../../models/Invoice";
import { Patient } from "../../models/Patient";
import { OrderedItemType } from "../../models/OrderedItemType";
import { CombinedBill } from '../../models/CombinedBill';
import { Admission } from '../../models/Admission';
import { ALERT_DANGER } from 'src/app/_configs/app-config';
import { ModalAlertService } from 'src/app/service/modal-alert.service';

@Component({
  selector: 'app-card-combined-bill',
  templateUrl: './card-combined-bill.component.html',
  styleUrls: ['./card-combined-bill.component.scss']
})
export class CardCombinedBillComponent implements OnInit {

  @Input() loadPage: boolean = false
  @Input() show: boolean = true

  @Input() data: CombinedBill[] = []

  @Output() dataChange = new EventEmitter<CombinedBill[]>()
  @Output() patientInfoChange = new EventEmitter<Patient>()
  @Output() orderedItemChange = new EventEmitter<OrderedItemType[]>()
  @Output() invoiceChange = new EventEmitter<Invoice>()
  @Output() removeBillEvent = new EventEmitter<any>()

  @Input() footer: boolean = false
  @Input() checkbox: boolean = false

  @Input() invoice: Invoice = Invoice.default()
  @Input() orderedItem: OrderedItemType[] = OrderedItemType.defaultArray()
  @Input() patientInfo: Patient = Patient.default()
  @Input() admissionList: Admission[] = []

  progress: boolean = false

  constructor(private paymentService: PaymentService,
    private alertService: ModalAlertService,) { }

  ngOnInit(): void {
  }

  removeBill(){
    this.data.forEach((i: any) => {
      if(i.checked) {
        i.checked = false;
        //this.admissionList.push(i);
        this.data = this.data.filter((j:any) => j!==i);
      }
    });
    this.dataChange.emit(this.data);
    this.removeBillEvent.emit();
  }

  combinedBillListChangeRadio(d: any, e: any): void {
    this.data[this.data.indexOf(d)].checked = e.target.checked;
  }

  combinedBillSelectAll(e: any): void {
    this.data.forEach((i: any) => {
      i.checked = e.target.checked;
    });
  }

  exportCombinedBill() {
    this.progress = true
    let req = {
      combine_bill_list: this.data,
      export_file_type: "excel"
    }
    this.paymentService.exportCombinedBill(req).subscribe((response) => {
      if(response.headers.get("response_code")!="00"){
        this.alertService.showModalAlert(`Failed to export file: ${response.headers.get("response_desc")}`, ALERT_DANGER)  
      }else{
        let blob = response.body as Blob;
        let filename: string = response.headers.get("content-disposition").split(";")[1].split("=")[1].replace(/"/g, '');
        var downloadUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        
        this.progress = false
        a.href = downloadUrl;
        a.download = filename;
        a.click();
      }
    })
  }
}
