import { Discharge } from "../Discharge";
import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";

export interface GetDischargeListResponse extends GlobalResponse{
    discharge_list: Discharge[]
    paging: Paging
}