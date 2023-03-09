import { Prepaid } from "../div-card-payment/Prepaid";
import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";

export interface GetPrepaidListByMrNoResponse extends GlobalResponse {
    prepaid_list: Prepaid[] 
    paging: Paging
}