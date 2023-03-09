import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalExtraLargeConfig, ModalLargeConfig } from 'src/app/_configs/modal-config';
import { ModalReturnSalesItemComponent } from '../../general-modal/modal-return-sales-item/modal-return-sales-item.component';
import { ModalAddSalesItemComponent } from '../../general-modal/modal-add-sales-item/modal-add-sales-item.component';
import {ModalMedicalOrderComponent} from "../../general-modal/modal-medical-order/modal-medical-order.component";
import { Patient } from '../../models/Patient';
import { PaymentService } from 'src/app/service/payment.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ALERT_DANGER } from 'src/app/_configs/app-config';
import { OrderedItemType } from '../../models/OrderedItemType';
import { OrderedItem } from '../../models/OrderedItem';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { RemoveArItemTransactionResponse } from '../../models/response/RemoveArItemTransactionResponse';
import { ModalCancelComponent } from '../../general-modal/modal-cancel/modal-cancel.component';

@Component({
  selector: 'app-card-ordered-item',
  templateUrl: './card-ordered-item.component.html',
  styleUrls: ['./card-ordered-item.component.scss']
})
export class CardOrderedItemComponent implements OnInit {
  
  @Input() loadPage: boolean = false;
  @Input() show: boolean = true;
  @Input() payment: boolean = false

  @Input() admissionList: any = [];

  @Output() dataChange = new EventEmitter<any>();
  progress: boolean = false;
  
  @Input() data: OrderedItemType[] = OrderedItemType.defaultArray();

  @Input() patientInfo: Patient = Patient.default()

  @Input() readOnly? : boolean = false;
  bsModalReturnSalesItem?: BsModalRef
  bsModalAddSalesItem?: BsModalRef
  bsModalMedicalOrder?: BsModalRef
  bsModalMedicalOrderTransaction?: BsModalRef
  bsModalCancel?: BsModalRef

  @Input() footer: boolean = false;
  @Input() showAddSalesItemButton: boolean = false;
  @Input() showRemoveSalesItemButton: boolean = false;

  removeArItemTransactionResponse!: RemoveArItemTransactionResponse

  exporting: boolean = false;

  orgId: number = 0
  hopeUserId: number = 0

  constructor(public bsModalService: BsModalService,
    private paymentService: PaymentService,
    private alertService: ModalAlertService,
    private token: TokenStorageService) { }

  ngOnInit(): void {
    const userData = this.token.getUserData();
    this.orgId = userData.organization_id
    this.hopeUserId = userData.hope_user_id
  }

  openModalReturnSalesItem(item: OrderedItem, salesItemType: string){
    let salesItem: OrderedItem = {...item}
    const initialState: ModalOptions = {
      initialState: {
        itemToReturn: salesItem,
        salesItemType: salesItemType
      },
    };
    this.bsModalReturnSalesItem = this.bsModalService.show(ModalReturnSalesItemComponent, Object.assign(ModalLargeConfig, initialState))
    this.bsModalReturnSalesItem.content.itemReturned.subscribe((item: OrderedItem) => {
      this.dataChange.emit(this.data)
    })
  }

  openModalAddItemIssueCategory(){
    const initialState: ModalOptions = {
      initialState: {
        admissionList: this.admissionList,
        orderedItem: this.data,
        primaryDoctorUserId: this.patientInfo.primary_doctor_user_id?.toString(),
        patientEmail: this.patientInfo.email,
        patientId: this.patientInfo.patient_id,
        selectedSalesItemCategory: {key: "1", value: "Item Issue"} 
      }
    }
    this.bsModalAddSalesItem = this.bsModalService.show(ModalAddSalesItemComponent, Object.assign(ModalExtraLargeConfig, initialState))
    this.bsModalAddSalesItem.content.dataSalesItem.subscribe((item: any) => {
      this.dataChange.emit(this.data);
    })
  }

  openModalAddTransactionCategory(){
    const initialState: ModalOptions = {
      initialState: {
        admissionList: this.admissionList,
        orderedItem: this.data,
        primaryDoctorUserId: this.patientInfo.primary_doctor_user_id?.toString(),
        patientEmail: this.patientInfo.email,
        selectedSalesItemCategory: {key: "0", value: "Transaction"},
        patientId: this.patientInfo.patient_id
      }
    }
    this.bsModalAddSalesItem = this.bsModalService.show(ModalAddSalesItemComponent, Object.assign(ModalExtraLargeConfig, initialState))
    this.bsModalAddSalesItem.content.dataSalesItem.subscribe((item: any) => {
      this.dataChange.emit(this.data);
    })
  }

  openModalMedicalOrder(){
    const initialState: ModalOptions = {
      initialState: {
        patientInfo: this.patientInfo
      }
    }
    this.bsModalMedicalOrder = this.bsModalService.show(ModalMedicalOrderComponent, Object.assign(ModalExtraLargeConfig, initialState));
  }

  salesItemListChangeRadio(c: any, d: any, e: any): void {
    const index_c = this.data.indexOf(c);
    const index_d = this.data[index_c].sales_item_list.indexOf(d);
    this.data[index_c].sales_item_list[index_d].checked = e.target.checked;
  }

  salesItemSelectAll(e: any): void {
    this.data.forEach((i: OrderedItemType) => {
      if(i.is_item_issue === '0'){
        i.checked = true
        i.sales_item_list.forEach((j: OrderedItem) => {
          j.checked = e.target.checked;
        });
      }
    });
  }

  salesItemTypeSelectAll(e: any, salesItem: OrderedItemType) {
    salesItem.sales_item_list.forEach((i: OrderedItem) => {
      i.checked = e.target.checked;
    });
  }

  exportOrderedItem() {
    this.exporting = true;

    let req: any = {
      sales_item_type_list: this.data,
      export_file_type: "excel"
    }
    this.paymentService.exportOrderedItem(req).subscribe((response) => {
      if(response.headers.get("response_code")!="00"){
        this.alertService.showModalAlert(`Failed to export file: ${response.headers.get("response_desc")}`, ALERT_DANGER)  
      }else{
        let blob = response.body as Blob;
        let filename: string = response.headers.get("content-disposition").split(";")[1].split("=")[1].replace(/"/g, '');
        var downloadUrl = window.URL.createObjectURL(blob);
        let a = document.createElement('a');
        a.href = downloadUrl;
        a.download = filename;
        a.click();
      }
      this.exporting = false;
    }, err => {
      this.exporting = false;
      this.alertService.showModalAlert(`Failed to export file. Please contact administration`,ALERT_DANGER)
    })
  }

  
  openModalCancel(){
    const initialState: ModalOptions = {
      initialState: {
        statusPage: "sales",
        orderedItem: this.data
      },
    };
    this.bsModalCancel = this.bsModalService.show(ModalCancelComponent, Object.assign(ModalLargeConfig, initialState));
    this.bsModalCancel.content.removeSalesItemChange.subscribe((item: any) => {
      this.dataChange.emit(this.data)
    })
  }

  removeOrderedItem() {
    //checked if filter > 0 
    this.openModalCancel()
    //else alert ('Please select item to be removed')
  }
}
