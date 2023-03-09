import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { Patient } from "../Patient";

export interface GetPatientListResponse extends GlobalResponse {
  patient_list: Patient[],
  paging: Paging
}
