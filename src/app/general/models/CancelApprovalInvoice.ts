export interface CancelApprovalInvoice{
   inv_cancellation_id: string,
   invoice_type: string,
   invoice_no: string,
   invoice_date: string,
   admission_no: number,
   admission_date: string,
   mr_no: string,
   patient_name: string,
   invoice_by: string,
   cancelled_date: string,
   cancelled_by: string,
   cancel_notes: string,
}