import { Uom } from "./Uom";

export interface SalesItemList{
   admission_no: string,
   store_id: number,
   sales_item_id: number,
   sales_item_name: string,
   qty: number,
   uom: string | any;
   doctor: string,
   price: number,
   amount: number,
   discount: number,
   patient_net: number,
   payer_net: number,
   package_name: string,
   notes: string,
   uom_list?: Array<Uom>,
}