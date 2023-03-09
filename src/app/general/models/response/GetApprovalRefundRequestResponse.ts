import { ApprovalRefundRequest } from "../ApprovalRefundRequest";
import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";

export interface GetApprovalRefundRequestResponse extends GlobalResponse {
    refund_appr_list: ApprovalRefundRequest[]
    paging: Paging
}