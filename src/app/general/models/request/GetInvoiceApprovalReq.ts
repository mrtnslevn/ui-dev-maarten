export interface GetInvoiceApprovalRequest{
   lob_id: number,
   invoice_no: string,
   invoice_by: string,
   invoice_date_from: string,
   invoice_date_to: string,
   cancel_date_from: string,
   cancel_date_to: string,
   mr_no?: number
   page_no: number
 }