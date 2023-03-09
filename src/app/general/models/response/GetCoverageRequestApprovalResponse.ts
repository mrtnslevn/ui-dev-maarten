import { GlobalResponse } from "../GlobalResponse";

export interface GetCoverageRequestApprovalResponse extends GlobalResponse{
   approved_coverage_payer: number
   approved_coverage_patient : number
}