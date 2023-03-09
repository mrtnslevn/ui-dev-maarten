import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { RefundInquiry } from "../RefundInquiry";

export interface GetRefundInquiryResponse extends GlobalResponse {
    refund_list: RefundInquiry[]
    paging: Paging
}