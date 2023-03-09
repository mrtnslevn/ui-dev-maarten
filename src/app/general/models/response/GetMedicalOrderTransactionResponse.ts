import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { MedicalOrderTransaction } from "../MedicalOrderTransaction";

export interface GetMedicalOrderTransactionResponse extends GlobalResponse {
  medical_order_list: MedicalOrderTransaction[],
  paging: Paging
}
