
export interface DepositIpdTransaction {
    transaction_type:string
    payment_mode: number
    payment_mode_name: string
    account_no: string
    account_name: string
    amount: number
    notes: string
    settlement_no: string
    transaction_no: string
    mr_no: number
    status: string
    created_by_name: string
    created_date: string
    admission_no:string
    patient_name:string
}

export interface DepositIpdTransactionSearch {
    mr_no: number|string| undefined,
    last_transaction_date_from: string,
    last_transaction_date_to: string,
    patient_name: string | '',
    deposit_no: string ,
    dob: string ,
    page_no: number,
}

export const DEPOSIT_IPD_TRANSACTION_SEARCH_KEY =  'deposit-ipd-transaction-params'
