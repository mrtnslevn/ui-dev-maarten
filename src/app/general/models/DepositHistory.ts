export interface DepositHistory{
    transaction_type?: string,
    transaction_no?: string,
    transaction_date?: string,
    payment_mode?: string,
    account_name?: string,
    account_no?: string,
    notes?: string,
    amount?: number,
    balance?: number,
    status?: string,
    invoice_no?: string,
    deposit_by: string,
    national_id_type_name: string,
    national_id_no: string,
    relationship_with_patient: string,
    approval_code: string,
    merchant_id: string,
 }