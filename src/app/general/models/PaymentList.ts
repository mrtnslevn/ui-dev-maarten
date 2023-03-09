export interface PaymentList{
   invoice_type: string,
   settlement_no: string,
   settlement_date: string,
   invoice_no: string,
   invoice_date: string,
   payment_mode: string,
   account_no: string,
   account_name: string,
   net: number,
   notes: string,
   patient_name: string,
   mr_no: number,
   settlement_status: string,
   created_by: string,
   cancelled_date?: string,
   cancelled_by?: string,
   cancel_notes?: string
}