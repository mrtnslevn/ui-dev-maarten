import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { Store } from "../Store";

export interface GetStoreListResponse extends GlobalResponse{
   store_list: Store[],
   paging: Paging
}