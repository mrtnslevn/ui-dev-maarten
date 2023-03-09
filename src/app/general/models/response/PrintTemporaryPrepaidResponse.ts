import { GlobalResponse } from "../GlobalResponse";

export interface PrintTemporaryPrepaidResponse extends GlobalResponse{
    patient_name: string
    prepaid_date: string
    patient_net: number
    data: string
    content_type: string
    report_name: string
}