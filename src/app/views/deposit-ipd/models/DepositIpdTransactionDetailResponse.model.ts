import { GlobalResponse } from "src/app/general/models/GlobalResponse";
import { DepositIpdDepositor } from "./DepositIpdDepositor.model";
import { DepositIpdPaymentSettlement } from "./DepositIpdPaymentSettlement.model";
export interface DepositIpdTransactionDetailResponse extends GlobalResponse {
    deposit_detail: DepositIpdPaymentSettlement
    log_depositor: DepositIpdDepositor
}