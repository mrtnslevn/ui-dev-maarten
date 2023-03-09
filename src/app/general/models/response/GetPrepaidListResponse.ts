import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { PrepaidList } from "../PrepaidList";

export interface GetPrepaidListResponse extends GlobalResponse{
   prepaid_list: PrepaidList[]
   paging: Paging
}