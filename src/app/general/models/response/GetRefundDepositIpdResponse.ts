import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { RefundDepositIpd } from "../RefundDepositIpd";

export interface GetRefundDepositIpdResponse extends GlobalResponse {
    patient_list: RefundDepositIpd[]
    paging: Paging
}