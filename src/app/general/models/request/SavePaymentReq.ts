import { Depositor } from "../Depositor"
import { Patient } from "../Patient"

export interface BaseSavePaymentRequest {
    payment_mode_id: number,
    amount: number,
    notes?: string | undefined,
    balance: number,
    cash?: SavePaymentCash,
    card?: SavePaymentCard,
    digital_payment?: SavePaymentDigital,
    qris?: SavePaymentQris,
    cheque_giro?: SavePaymentGiro,
    bank_transfer?: SavePaymentBankTransfer,
    additional_payer?: SavePaymentAdditionalPayer,
    prepaid?: SavePaymentPrepaid
}

export interface SavePaymentRequest extends BaseSavePaymentRequest {
    invoice_no: string,
    invoice_id: number
}

export interface SavePaymentPrepaidRequest extends BaseSavePaymentRequest {
    prepaid_id: string
}
export interface SavePaymentDepositRequest extends BaseSavePaymentRequest{
    admission_no: string,
    admission_id: number,
    org_id: number,
    payment_mode_name: string,
    patient_info: Patient,
    depositor_data: Depositor 
}

export interface SavePaymentCash {
    cash_amount: number
}

export interface SavePaymentCard {
    debit_credit_type: string,
    edc_id: number,
    merchant_id: string,
    card_no: string,
    card_holder_name: string,
    bank_id: number,
    approval_code: string,
    transaction_id: string,
    card_expiry_date: string,
    reference_no: string,
    is_integrated: string
}

export interface SavePaymentDigital {
    payment_code: string,
    transaction_id: string,
    payment_type: string,
    acquiring_bank: string,
    bank_number: string,
    card_assoc: string,
    card_no: string,
    customer_name: string,
    notes: string,
}

export interface SavePaymentQris {
    settlement_no: string | undefined,
    transaction_id: string,
    phone_no: string | undefined,
    issuer: string,
    payment_date: string,
    approval_code: string,
    notes: string,
    customer_name: string | undefined,
}

export interface SavePaymentGiro {
    bank_id: number,
    cheque_no: string,
    cheque_date: string,
}

export interface SavePaymentAdditionalPayer{
    payer_id: number,
    payer_id_no: string,
    eligibility_no: string,
}

export interface SavePaymentBankTransfer{
    bank_id: number;
    account_no: string;
    account_name: string;
    transfer_date: string;
    reference_no: string;
    receipt_bank_acc_id: number;
    receipt_bank_acc_name: string;
}

export interface SavePaymentPrepaid {
    booking_id: string,
    booking_name: string
}

// Default Value

export class SavePaymentCash {
    static default(): SavePaymentCash {
        return {
            cash_amount: 0
        }
    }
}

export class SavePaymentCard {
    static default(): SavePaymentCard {
        return {
            debit_credit_type: "",
            edc_id: 0,
            merchant_id: "",
            card_no: "",
            card_holder_name: "",
            bank_id: 0,
            approval_code: "",
            transaction_id: "",
            card_expiry_date: "",
            reference_no: '',
            is_integrated: ''
        }
    }
}

export class SavePaymentDigital {
    static default(): SavePaymentDigital {
        return {
            payment_code: "",
            transaction_id: "",
            payment_type: "",
            acquiring_bank: "",
            bank_number: "",
            card_assoc: "",
            card_no: "",
            customer_name: "",
            notes: ""
        }
    }
}

export class SavePaymentQris {
    static default(): SavePaymentQris {
        return {
            settlement_no: "",
            transaction_id: "",
            phone_no: "",
            issuer: "",
            payment_date: "",
            approval_code: "",
            notes: "",
            customer_name: "",
        }
    }
}

export class SavePaymentGiro {
    static default(): SavePaymentGiro {
        return {
            bank_id: 0,
            cheque_no: "",
            cheque_date: "",
        }
    }
}

export class SavePaymentAdditionalPayer {
    static default(): SavePaymentAdditionalPayer {
        return {
            payer_id: 0,
            payer_id_no: "",
            eligibility_no: "",
        }
    }
}

export class SavePaymentBankTransfer {
    static default(): SavePaymentBankTransfer {
        return {
            bank_id: 0,
            account_no: "",
            account_name: "",
            transfer_date: "",
            reference_no: "",
            receipt_bank_acc_id: 0,
            receipt_bank_acc_name: "",
        }
    }
}

export class SavePaymentPrepaid {
    static default(): SavePaymentPrepaid {
        return {
            booking_id: '',
            booking_name: ''
        }
    }
}