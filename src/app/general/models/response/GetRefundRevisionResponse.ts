import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { RefundRevision } from "../RefundRevision";

export interface GetRefundRevisionResponse extends GlobalResponse {
    refund_revision_list: RefundRevision[]
    paging: Paging
}