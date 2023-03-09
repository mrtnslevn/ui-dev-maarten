import { CancelApprovalInvoice } from "../CancelApprovalInvoice";
import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";

export interface GetInvoiceCancellationResponse extends GlobalResponse{
   cancel_appr_list: CancelApprovalInvoice
   paging: Paging
}