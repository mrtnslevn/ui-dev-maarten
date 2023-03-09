import { GlobalResponse } from "src/app/general/models/GlobalResponse";
import { Paging } from "src/app/general/models/Paging";
import { DepositPrepaidHistory } from "./deposit-prepaid-history.model";
export interface DepositPrepaidHistoryResponse extends GlobalResponse {
    deposit_ipd_list: DepositPrepaidHistory[]
    paging: Paging
}