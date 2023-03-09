import { GlobalResponse } from "../GlobalResponse";

export interface MidtransPaymentResponse extends GlobalResponse{
    payment_code: string,
    payment_url: string
}