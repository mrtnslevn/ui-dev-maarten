import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { PrepaidDetail } from "../PrepaidDetail";

export interface GetPrepaidTransactionResponse extends GlobalResponse{
   prepaid_detail_list: PrepaidDetail[]
   settled_amount: number
   balance: number
   amount_to_be_settled: number
   prepaid_date: string
   patient_name: string
   email: string
   phone_no: string
   address: string
   paging: Paging
}