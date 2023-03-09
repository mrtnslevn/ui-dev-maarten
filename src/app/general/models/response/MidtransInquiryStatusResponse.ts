import { GlobalResponse } from "../GlobalResponse";

export interface MidtransInquiryStatusResponse extends GlobalResponse{
    payment_code: string,
    paid_status: boolean,
    transaction_id: string,
    payment_type: string,
    acquiring_bank?: string,
    bank_number?: string,
    card_assoc?: string,
    card_no?: string,
    customer_name?: string
}