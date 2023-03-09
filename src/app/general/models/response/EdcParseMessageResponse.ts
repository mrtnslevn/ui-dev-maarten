import { GlobalResponse } from "../GlobalResponse";

export interface EdcParseMessageResponse extends GlobalResponse {
    edc_response_code: string,
    merchant_id: string,
    card_no: string,
    card_holder_name: string,
    bank: string,
    approval_code: string,
    transaction_id: string,
    card_expiry_date: string,
    reference_no: string,
}