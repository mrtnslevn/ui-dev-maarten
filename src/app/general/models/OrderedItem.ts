import { Uom } from "./Uom";

export interface OrderedItem {
  admission_id: number,
  admission_no: string;
  ar_item_id: number;
  store_id: number;
  sales_item_id: number;
  sales_order_id: number;
  sales_item_name: string;
  qty: number;
  uom: string;
  uom_id: number;
  doctor: string;
  price: number;
  amount: number;
  discount: number;
  patient_net: number;
  payer_net: number;
  package_name: string;
  note: string;
  uom_list: Uom[];
  start_date?: string,
  end_date?: string,
  notes: string,
  package_id?: number,
  checked?: boolean
}

export class OrderedItem {
  static default(): OrderedItem {
    return {
      admission_id: 0,
      admission_no: '',
      ar_item_id: 0,
      store_id: 0,
      sales_item_id: 0,
      sales_order_id: 0,
      sales_item_name: '',
      qty: 0,
      uom: '',
      uom_id: 0,
      doctor: '',
      price: 0,
      amount: 0,
      discount: 0,
      patient_net: 0,
      payer_net: 0,
      package_name: '',
      note: '',
      uom_list: [],
      notes: '',
      package_id: 0,
      checked: false
    }
  }

  static defaultArray(): OrderedItem[] {
    return [this.default()]
  }
}