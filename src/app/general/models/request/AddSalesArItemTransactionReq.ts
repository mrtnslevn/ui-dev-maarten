import { AddSalesArItemTransactionDetailRequest } from "./AddSalesArItemTransactionDetailReq"

export interface AddSalesArItemTransactionRequest {
    organization_id: number,
    admission_id: number,
    admission_no: string,
    user_id: number,
    doctor_user_id: number,
    email_type_id: number,
    email_address: string,
    notes: string,
    list_item_transaction: AddSalesArItemTransactionDetailRequest[]
}