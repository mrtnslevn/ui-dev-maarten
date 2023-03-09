import { Doctor } from "../Doctor";
import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";

export interface GetDoctorListResponse extends GlobalResponse{
   doctor_list: Doctor[]
   paging: Paging
}