export interface DepositIpdPaymentSettlement {
    settlement_no: string
    payment_mode_id: number
    payment_mode: string
    account_no: string
    account_name: string
    amount: string
    notes: string
    settlement_date: string
    deposit_by: string
    cash?: any
    card?: any
    bank_transfer?: any
    cheque_giro?: any
    digital_payment?: any
    admission_no : string
    transaction_type: string
    closing_balance: number
    opening_balance: number
    email:string
}
