export interface ApprovalRefundRequest{
   refund_type_name: string,
   refund_id: string,
   booking_id: string,
   refund_date: string,
   print_prf_date: string,
   print_prf_name: string,
   payment_mode_name: string,
   account_no: string,
   account_name: string,
   mr_no: number,
   patient_name: string,
   refund_amount: number,
   refund_notes: string,
   refund_by_name: string,
   
 }

 export class ApprovalRefundRequest {
    static deafult(): ApprovalRefundRequest {
       return {
        refund_type_name: '',
        refund_id: '',
        booking_id: '',
        refund_date: '',
        print_prf_date: '',
        print_prf_name: '',
        payment_mode_name: '',
        account_no: '',
        account_name: '',
        mr_no: 0,
        patient_name: '',
        refund_amount: 0,
        refund_notes: '',
        refund_by_name: ''
       }
    }
 }