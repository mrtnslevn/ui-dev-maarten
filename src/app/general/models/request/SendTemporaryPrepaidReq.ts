import { BookingInformation } from "../BookingInformation";
import { BaseSendReportRequest } from "./BaseSendReportReq";
import { PrintTemporaryPrepaidRequest } from "./PrintTemporaryPrepaidReq";

export interface SendTemporaryPrepaidRequest extends BaseSendReportRequest, PrintTemporaryPrepaidRequest {
    prepaid_list: BookingInformation[]
    whatsapp: string
    email: string
    nationality_id: number
    discount: number
}