import { GlobalResponse } from "src/app/general/models/GlobalResponse";
import { Paging } from "src/app/general/models/Paging";
import { DepositIpdList } from "./DepositIpdList.model";
export interface DepositIpdListResponse extends GlobalResponse {
    master_deposit_list: DepositIpdList[]
    paging: Paging
}