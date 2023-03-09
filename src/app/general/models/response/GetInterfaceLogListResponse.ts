import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import {InterfaceLogList} from "../InterfaceLogList";

export interface GetInterfaceLogListResponse extends GlobalResponse{
   interface_log_list: InterfaceLogList[]
   paging: Paging
}
