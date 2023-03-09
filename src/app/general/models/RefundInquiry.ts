export interface RefundInquiry{
    refund_type: string
    refund_id: string
    refund_date: string
    booking_id: number
    print_prf_date: string
    print_prf_name: string
    payment_mode_name: string
    account_no: number
    account_name: string
    mr_no: number
    patient_name: string
    refund_amount: number
    approval_status: string
    refund_reason_name: string
    refund_notes: string
    refund_by_name: string
 }

 export class RefundInquiry {
    static deafult(): RefundInquiry {
       return {
        refund_type: '',
        refund_id: '',
        refund_date: '',
        booking_id: 0,
        print_prf_date: '',
        print_prf_name: '',
        payment_mode_name: '',
        account_no: 0,
        account_name: '',
        mr_no: 0,
        refund_amount: 0,
        patient_name: '',
        approval_status: '',
        refund_reason_name: '',
        refund_notes: '',
        refund_by_name: '',
       }
    }
 }