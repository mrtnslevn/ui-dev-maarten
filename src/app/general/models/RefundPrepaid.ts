export interface RefundPrepaid{
   prepaid_id:string
   booking_id: number
   order_id: number
   service_name: string
   mr_no: number
   patient_name: string
   prepaid_date: string
   appointment_date: string
   id_no: string
   status: string
   created_by: string
   package_name: string
   transaction_date: string
   expired_date: string
 }

 export class RefundPrepaid {
    static deafult(): RefundPrepaid {
       return {
         prepaid_id: '',
         booking_id: 0,
         order_id: 0,
         service_name: '',
         mr_no: 0,
         patient_name: '',
         prepaid_date: '',
         appointment_date: '',
         id_no: '',
         status: '',
         expired_date: '',
         transaction_date: '',
         package_name: '',
         created_by: ''
       }
    }

    static readonly PARAM_KEY = "refund-prepaid"
 }