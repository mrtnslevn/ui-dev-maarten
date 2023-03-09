import {Component, Input, OnInit} from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalExtraLargeConfig } from 'src/app/_configs/modal-config';
import { ModalCustomAdditionalDiscountComponent } from '../../general-modal/modal-custom-additional-discount/modal-custom-additional-discount.component';
import {Sales_Discount} from "../../models/Sales_Discount";

@Component({
  selector: 'app-card-sales-discount',
  templateUrl: './card-sales-discount.component.html',
  styleUrls: ['./card-sales-discount.component.scss']
})
export class CardSalesDiscountComponent implements OnInit {

  @Input() loadCard: boolean = false
  @Input() invoiceNo: string = ''

  dataModal: any = {}

  @Input() data: Sales_Discount[] = [{
    admission_no: '',
    sales_discount_type_id: '',
    sales_discount_type_name: '',
    predefined_discount_id: '',
    predefined_discount_name: '',
    custom_add_discount_list: [],
  }];

  bsModalRef?: BsModalRef;

  constructor(private bsModalService: BsModalService) { }

  ngOnInit(): void {
    
  }

  showModalCustom(dataPatient: any) : void {
    this.dataModal = dataPatient;

    const initialState: ModalOptions = {
      initialState: {
        // data: dataPatient.custom_add_discount_list,
        title: 'View Custom Additional Discount',
        invoice_no: this.invoiceNo,
      },
    };
    this.bsModalRef = this.bsModalService.show(ModalCustomAdditionalDiscountComponent, Object.assign(ModalExtraLargeConfig, initialState))
  }


}
