import { GlobalResponse } from "../GlobalResponse";

export interface GetEdcDetailResponse extends GlobalResponse {
    edc_id: number,
    edc_name: string,
    merchant_id: number,
    merchant_name: string,
    bank_id: number
}