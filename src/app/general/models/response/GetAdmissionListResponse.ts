import { Admission } from "../Admission";
import { GlobalResponse } from "../GlobalResponse";

export interface GetAdmissionListResponse extends GlobalResponse {
    admission_list: Admission[],
}