import { Admission } from "../Admission";
import { GlobalResponse } from "../GlobalResponse";

export interface GetAdmissionDetailDepositResponse extends GlobalResponse {
    admission_list: Admission[],
}