import { Patient } from "../Patient";
import { PaymentLob } from "../PaymentLob";
import { PaymentMode } from "../PaymentMode";

export interface ApprovalPaymentCancellationSearchParam {
    lob: PaymentLob,
    invoice_no: string,
    payment_mode: PaymentMode,
    settlement_date_from: string,
    settlement_date_to: string,
    cancel_request_date_from: string,
    cancel_request_date_to: string,
    page_no: number,
    mr_no: number,
    patient_name: string,
}

export class ApprovalPaymentCancellationSearchParam {
    static readonly PARAM_KEY = "approval-payment-cancellation-search-params"
}