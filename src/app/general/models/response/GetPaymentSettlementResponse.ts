import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { Payment_Settlement } from "../Payment_Settlement";

export interface GetPaymentSettlementResponse extends GlobalResponse{
   payment_settlement_list: Payment_Settlement[]
   paging: Paging
}