import { GlobalResponse } from "src/app/general/models/GlobalResponse";
import { Paging } from "src/app/general/models/Paging";
import { DepositIpdTransaction } from "./DepositIpdTransaction.model";
export interface DepositIpdTransactionResponse extends GlobalResponse {
    payment_settlement_list: DepositIpdTransaction[]
    paging: Paging
}