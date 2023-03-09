import { GlobalResponse } from "../GlobalResponse"

export interface SavePaymentResponse extends GlobalResponse{
    balance: number
    settled_amount: number
    settlement_no: string
    payer_balance: number
    total_balance: number
}