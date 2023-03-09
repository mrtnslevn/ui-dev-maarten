import { GlobalResponse } from "src/app/general/models/GlobalResponse";
import { Paging } from "src/app/general/models/Paging";
import { DepositIpdHistory } from "./DepositIpdHistory.model";

export interface DepositIpdHistoryResponse extends GlobalResponse {
    deposit_history_list: DepositIpdHistory[]
    paging: Paging
}