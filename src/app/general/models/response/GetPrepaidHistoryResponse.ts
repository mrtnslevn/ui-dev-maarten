import { PrepaidHistory } from "src/app/views/prepaid/models/prepaid-history.model";
import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";

export interface GetPrepaidHistoryResponse extends GlobalResponse{
   prepaid_history_list: PrepaidHistory[]
   paging: Paging
}