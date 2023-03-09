export interface DepositIpdHistory {
    transaction_type?: string
    transaction_no?: string
    transaction_date?: string
    payment_mode?: string
    account_no?: string
    approval_code?: string | null
    merchant_id?: string | null
    account_name?: string
    amount?: number
    balance?: number
    status?: string
    invoice_no?: string
    notes?: string
    deposit_by?: string
    created_by?: string
    national_id_type_id?: number | null
    national_id_type_name?: string | null
    national_id_no?: string
    relationship_with_patient?: string | null
}