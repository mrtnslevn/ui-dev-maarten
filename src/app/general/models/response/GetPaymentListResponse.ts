import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { PaymentList } from "../PaymentList";

export interface GetPaymentListResponse extends GlobalResponse{
   payment_list: PaymentList[]
   paging: Paging
}