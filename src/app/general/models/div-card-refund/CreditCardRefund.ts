export interface CreditCardRefund{
    card_no: string
    card_holder_name: string
    identity_no: string
    reference_no: string
    approval_code: string
    merchant_id: string
}

export class CreditCardRefund {
    static default(): CreditCardRefund {
      return {
        card_no: '',
        card_holder_name: '',
        identity_no: '',
        reference_no: '',
        approval_code: '',
        merchant_id: '',
      }
    }
  }