import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { RefundPrepaid } from "../RefundPrepaid";

export interface GetRefundPrepaidResponse extends GlobalResponse {
    prepaid_list: RefundPrepaid[]
    paging: Paging
}