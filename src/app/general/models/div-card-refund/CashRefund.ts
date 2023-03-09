export interface CashRefund{
    received_by: string
    identity_type_id: number
    identity_no: string
    phone_no: string
}

export class CashRefund {
    static default(): CashRefund {
      return {
        received_by: '',
        identity_type_id: 0,
        identity_no: '',
        phone_no: ''
      }
    }
  }