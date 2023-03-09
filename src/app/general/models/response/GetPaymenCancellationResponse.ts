import { CancelApprovalPayment } from "../CancelApprovalPayment";
import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";

export interface GetPaymentCancellationResponse extends GlobalResponse{
   cancel_appr_list: CancelApprovalPayment
   paging: Paging
}