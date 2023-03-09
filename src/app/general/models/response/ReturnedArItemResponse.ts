import { GlobalResponse } from "../GlobalResponse";

export interface ReturnedArItemResponse extends GlobalResponse {
    transaction_details: ReturnArItemIssueData[]
}

export interface ReturnArItemIssueData {
    ar_item_id: number,
    order_date: string,
    sales_order_id: number,
    sales_order_no: string,
    doctor_user_id: number,
    doctor_user: string,
    is_default_invoice_class: boolean,
    invoice_class_ar_item_id: number,
    invoice_class_id: number,
    class_id: number,
    class_name: string,
    package_sales_item_type_id: number,
    package_sales_item_id: number,
    package_ar_item_id: number,
    package_name: string,
    sales_item_id: number,
    sales_item_name: string,
    sales_item_type_id: number,
    sales_item_type_name: string,
    sales_priority_id: number,
    ar_item_quantity: number,
    uom_id: number,
    uom_ratio: number,
    ar_item_sales_price: number,
    ar_item_item_amount: number,
    ar_item_item_taxable_amount: number,
    ar_item_item_tax_amount: number,
    ar_item_item_other_amount: number,
    ar_item_item_net_amount: number,
    ar_item_patient_net_amount: number,
    ar_item_payer_net_amount: number,
    return_ar_item_id: number,
    ar_item_cancel_date: string,
    item_discount_amount: number,
    notes: string,
    start_date: string,
    end_date: string,
    store_id: number
}