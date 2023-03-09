
import { DepositHistory } from "../DepositHistory";
import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";

export interface GetDepositHistoryResponse extends GlobalResponse{
   deposit_history_list: DepositHistory[]
   paging: Paging
}