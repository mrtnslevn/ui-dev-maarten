import { BaseSendReportRequest } from "./BaseSendReportReq";
import { PrintPrepaidRequest } from "./PrintPrepaidReq";

export interface SendPrepaidRequest extends BaseSendReportRequest, PrintPrepaidRequest {
    
}