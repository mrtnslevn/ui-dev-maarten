import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { MedicalOrder } from "../MedicalOrder";

export interface GetMedicalOrderResponse extends GlobalResponse {
  medical_order_list: MedicalOrder[],
  paging: Paging
}
