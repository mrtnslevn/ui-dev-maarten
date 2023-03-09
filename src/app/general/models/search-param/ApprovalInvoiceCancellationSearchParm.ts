import { Patient } from "../Patient";
import { PaymentLob } from "../PaymentLob";

export interface ApprovalInvoiceCancellationSearchParam {
    lob: PaymentLob,
    invoice_no: string,
    invoice_date_from: string,
    invoice_date_to: string,
    cancel_request_date_from: string,
    cancel_request_date_to: string,
    page_no: number,
    mr_no: number,
    patient_name: string,
}

export class ApprovalInvoiceCancellationSearchParam {
    static readonly PARAM_KEY = "approval-invoice-cancellation-search-params"
}