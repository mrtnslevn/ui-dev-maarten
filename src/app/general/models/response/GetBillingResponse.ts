import { GlobalResponse } from "../GlobalResponse";
import { OrderedItemType } from "../OrderedItemType";
import { SaveInvoiceOrderedItem } from "../request/SaveInvoiceReq";

export interface GetBillingResponse extends GlobalResponse {
    payer_gross: number,
    payer_admin: number,
    // payer_limit_type: string,
    // payer_limit_factor: number,
    // payer_limit: number,
    // payer_discount_type: string,
    // payer_discount_factor: number,
    // payer_discount: number,
    payer_net: number,
    payer_balance: number,
    patient_gross: number,
    patient_admin: number,
    // patient_limit: number,
    // patient_discount_type: number,
    // patient_discount_factor: number,
    // patient_discount: number,
    patient_net: number,
    patient_balance: number,
    total_gross: number,
    // total_discount: number,
    total_admin: number,
    // total_rounding: number,
    total_net: number,
    total_balance: number,
    sales_item_type_list: OrderedItemType[],
    ordered_item_list: SaveInvoiceOrderedItem[]
}