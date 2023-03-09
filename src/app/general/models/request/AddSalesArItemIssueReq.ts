import { AddSalesArItemIssueDetailRequest } from "./AddSalesArItemIssueDetailReq";

export interface AddSalesArItemIssueRequest {
    organization_id: number,
    admission_id: number,
    admission_no: string,
    store_id: number,
    user_id: number,
    doctor_user_id: number,
    notes: string,
    item_details: AddSalesArItemIssueDetailRequest[]
}