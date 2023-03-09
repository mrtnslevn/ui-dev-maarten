import { CombinedBill } from "../CombinedBill";
import { GlobalResponse } from "../GlobalResponse";

export interface GetCombinedBillResponse extends GlobalResponse{
   admission_list: CombinedBill[]
}