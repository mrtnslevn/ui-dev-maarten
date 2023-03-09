export interface CancelReasonReq{
   invoice_no?: string,
   settlement_no?: string,
   org_id: number,
   cancel_reason_id: number,
   cancel_notes: string,
   is_direct_approve: string,
   approved_by: string,
   approver_role_id?: string,
   approver_user_id?: number
}