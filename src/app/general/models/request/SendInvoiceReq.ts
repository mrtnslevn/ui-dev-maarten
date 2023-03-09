import { BaseSendReportRequest } from "./BaseSendReportReq";
import { PrintInvoiceRequest } from "./PrintInvoiceReq";

export interface SendInvoiceRequest extends BaseSendReportRequest, PrintInvoiceRequest {
    notes: string
}