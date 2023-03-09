export interface PaymentCancellation{
   appr_id: string,
    invoice_type: string,
    settlement_no: string,
    settlement_date: string,
    invoice_no: string,
    invoice_date: string,
    account_no: string,
    net: number,
    notes: string,
    patient_name: string,
    mr_no: number,
    settlement_status: string,
    payment_by: string,
    cancelled_date: string,
    cancelled_by: string,
    cancel_notes: string
}
