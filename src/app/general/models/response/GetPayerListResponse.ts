import { Payer } from "../div-card-payment/Payer";
import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";

export interface GetPayerListResponse extends GlobalResponse {
  payer_list: Payer[],
  paging: Paging
}
