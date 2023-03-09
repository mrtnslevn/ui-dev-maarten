export interface GetBillingReqAdmission {
    admission_no: string,
    // mr_no: number
}
export interface GetBillingRequest {
    admission_list: GetBillingReqAdmission[]
    // payer_discount_type_id?: number,
    // payer_discount_factor?: number
    // patient_discount_type_id?: number
    // patient_discount_factor?: number
}