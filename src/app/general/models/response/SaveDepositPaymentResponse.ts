import { GlobalResponse } from "../GlobalResponse";

export interface SaveDepositPaymentResponse extends GlobalResponse {
    deposit_no: string,
    payment_mode_name: string,
    account_no: string,
    account_name: string,
    amount: number,
    notes: string,
    deposit_by: string
    last_balance: number
}