import { Doctor } from "./Doctor";
import { SalesItemType } from "./SalesItemType";
import { Store } from "./Store";
import { Uom } from "./Uom";

export interface SalesItem {
    admission_id: number,
    admission_no: string,
    sales_item_type: SalesItemType,
    store: Store,
    sales_item_id: number,
    sales_item_code: string,
    sales_item_name: string,
    stock?: number,
    quantity?: number,
    uom?: Uom,
    price_per_item: number,
    default_price: number,
    doctor: Doctor,
    start_date?: string,
    end_date?: string,
    notes: string,
    general_notes: string,
    uom_list: Uom[],
    is_cito?: number
    email_type_id?: number,
    email_address: string,
    cpoe_trans_id?: string,
    encounter_id?: number
}

export class SalesItem {
    static default(): SalesItem {
        return {
            admission_id: 0,
            admission_no: '',
            sales_item_type: SalesItemType.default(),
            store: Store.default(),
            sales_item_id: 0,
            sales_item_code: "",
            sales_item_name: "",
            stock: 0,
            quantity: 0,
            uom: Uom.default(),
            price_per_item: 0,
            default_price: 0,
            doctor: Doctor.default(),
            notes: "",
            general_notes: "",
            uom_list: [],
            email_address: "",
          }
    }
}