export interface RefundRevision{
    refund_type: string
    refund_id: string
    refund_date: string
    booking_id: number
    payment_mode: string
    mr_no: number
    amount: number
    patient_name: string
 }

 export class RefundRevision {
    static deafult(): RefundRevision {
       return {
        refund_type: '',
        refund_id: '',
        refund_date: '',
        booking_id: 0,
        payment_mode: '',
        mr_no: 0,
        amount: 0,
        patient_name: '',
       }
    }
 }