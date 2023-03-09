export interface GetPaymentApprovalRequest{
   lob_id: number,
   invoice_no: string,
   payment_mode_id: number,
   settlement_date_from: string,
   settlement_date_to: string,
   cancel_date_from: string,
   cancel_date_to: string,
   mr_no?: number,
   page_no: number,
}