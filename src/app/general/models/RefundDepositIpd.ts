export interface RefundDepositIpd{
    mr_no: number
    patient_name: string
    id_no: number
    sex: string
    dob: string
    address: string
    phone_no: string
    contact_no: string
    age: number
    deposit_amount: number
    patient_id: number
    nationality_id: number
 }

 export class RefundDepositIpd {
    static default(): RefundDepositIpd {
       return {
        mr_no: 0,
        patient_name: '',
        id_no: 0,
        sex: '',
        dob: '',
        address: '',
        phone_no: '',
        contact_no: '',
        deposit_amount: 0,
        age: 0,
        patient_id: 0,
        nationality_id: 0
       }
    }

    static readonly PARAM_KEY = "refund-deposit-ipd"
 }