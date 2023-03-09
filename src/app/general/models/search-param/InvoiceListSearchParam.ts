import { Patient } from "../Patient";
import { PaymentLob } from "../PaymentLob";

export interface InvoiceListSearchParam {
    lob: PaymentLob,
    admission_no: string,
    invoice_no: string,
    created_user: string,
    invoice_date_from: string,
    invoice_date_to: string,
    page_no: number,
    mr_no: number,
    patient_name: string,
    status: string,
    settlement_status: string
}

export class InvoiceListSearchParam {
    static readonly PARAM_KEY = "invoice-list-search-params"
}