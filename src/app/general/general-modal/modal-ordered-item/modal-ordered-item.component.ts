import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GeneralService } from 'src/app/service/general.service';
import { PaymentService } from 'src/app/service/payment.service';
import { RESPONSE_SUCCESS } from 'src/app/_configs/app-config';

@Component({
  selector: 'app-modal-ordered-item',
  templateUrl: './modal-ordered-item.component.html',
  styleUrls: ['./modal-ordered-item.component.scss']
})
export class ModalOrderedItemComponent implements OnInit {

  @Output() selectedItem = new EventEmitter<any>();

  constructor(private generalService: GeneralService, public bsModalRef: BsModalRef) { }
  getWrapperResponse: any = {}
  listOrderedItem: any = []
  orderedItem: any[] = [];

  ngOnInit(): void {
    this.getOrderedItem()
  }

  getOrderedItem(){
    this.orderedItem.forEach(o => {
      o.sales_item_list.forEach((s: any) => {
        let item: any = {};
        item.admission_no = s.admission_no;
        item.amount = s.amount;
        item.ar_item_id = s.ar_item_id;
        item.discount = s.discount;
        item.doctor = s.doctor;
        item.notes = s.notes;
        item.package_id = s.package_id;
        item.package_name = s.package_name;
        item.patient_net = s.patient_net;
        item.payer_net = s.payer_net;
        item.price = s.price;
        item.qty = s.qty;
        item.sales_item_id = s.sales_item_id;
        item.sales_item_name = s.sales_item_name;
        item.store_id = s.store_id;
        item.uom = s.uom;
        item.uom_id = s.uom_id;
        item.uom_list = s.uom_list;
        this.listOrderedItem.push(item);
      });
    })
  }

  onSelectItem(value: any){
    this.selectedItem.emit(value);
    this.bsModalRef.hide();
  }
}
