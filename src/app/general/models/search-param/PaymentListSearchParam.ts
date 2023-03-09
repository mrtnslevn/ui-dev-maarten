import { Patient } from "../Patient";
import { PaymentLob } from "../PaymentLob";
import { PaymentStatus } from "../PaymentStatus";

export interface PaymentListSearchParam {
    lob: PaymentLob,
    settlement_status: PaymentStatus,
    settlement_date_from: string,
    settlement_date_to: string,
    invoice_no: string,
    settlement_no?: string,
    created_user: string,
    page_no: number,
    mr_no: number,
    patient_name: string,
}

export class PaymentListSearchParam {
    static readonly PARAM_KEY = "payment-list-search-params"
}