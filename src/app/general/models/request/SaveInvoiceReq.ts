import { CombinedBill } from "../CombinedBill";
import { Invoice } from "../Invoice";
import { OrderedItem } from "../OrderedItem";
import { Patient } from "../Patient";
import { Uom } from "../Uom";

export interface SaveInvoiceRequest {
    combined_bill_list: CombinedBill[],
    invoice: Invoice,
    main_admission: Patient,
    ordered_item_list: SaveInvoiceOrderedItem[],
    patient_discount_type_id: number,
    patient_discount_numeric_factor: number,
    // patient_discount_amount: number,
    payer_discount_type_id: number,
    payer_discount_numeric_factor: number,
    // payer_discount_amount: number,
    notes: string,
    contact_no: string,
    promotion_code: string
}

export interface SaveInvoiceOrderedItem {
    admission_no: string;
    sales_item_type_id: number,
    ar_item_id?: number;
    store_id: number;
    sales_item_id: number;
    sales_item_name: string;
    qty: number;
    uom: string;
    uom_id: string;
    doctor: string;
    price: number;
    amount: number;
    discount: number;
    patient_net: number;
    payer_net: number;
    package_name: string;
    uom_list: Uom[];
    start_date?: string,
    end_date?: string,
    notes: string,
    package_id?: number,
    email_to: string
}

export class SaveInvoiceOrderedItem {
    static default(): SaveInvoiceOrderedItem {
        return {
            admission_no: '',
            sales_item_type_id: 0,
            ar_item_id: 0,
            store_id: 0,
            sales_item_id: 0,
            sales_item_name: '',
            qty: 0,
            uom: '',
            uom_id: '',
            doctor: '',
            price: 0,
            amount: 0,
            discount: 0,
            patient_net: 0,
            payer_net: 0,
            package_name: '',
            notes: '',
            uom_list: [],
            package_id: 0,
            email_to: ''
        }
    }
}