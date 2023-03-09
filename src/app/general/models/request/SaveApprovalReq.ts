export interface SaveApprovalReq{
   inv_cancellation_id?: string
   payment_cancellation_id?: string
   appr_type: string
   reject_reason_id: number
   approval_notes: string
}