export interface SaveRefundRequest {
    refund_type: string,
      mr_no: number,
      org_id: number,
      admission_no: string,
      patient_id: number
      patient_name: string,
      dob: string
      refund_documents: [],
      opening_balance: number,
      refund_amount: number,
      payment_mode_id: number,
      refund_reason_id: number,
      refund_reason_name: string
      refund_notes: string,
      request_type: string
      cash?: SaveRefundCash
      credit_card?: SaveRefundCreditCard
      bank_transfer?: SaveRefundBankTransfer
}

export interface SaveRefundCash {
    received_by: string
    identity_type_id: number
    identity_no: string
    phone_no: string
}

export interface SaveRefundCreditCard {
    card_no: string
    card_holder_name: string
    identity_no: string
    reference_no: string
    approval_code: string
    merchant_id: string
}

export interface SaveRefundBankTransfer {
    bene_account_no: string
    bank_id: number
    bene_account_name: string
    refund_source_account_id : number
}

export class SaveRefundCash {
    static default(): SaveRefundCash {
        return {
            received_by: '',
            identity_type_id: 0,
            identity_no: '',
            phone_no: ''
        }
    }
}

export class SaveRefundCreditCard {
    static default(): SaveRefundCreditCard {
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

export class SaveRefundBankTransfer {
    static default(): SaveRefundBankTransfer {
        return {
            bene_account_no: '',
            bank_id: 0,
            bene_account_name: '',
            refund_source_account_id: 0
        }
    }
}