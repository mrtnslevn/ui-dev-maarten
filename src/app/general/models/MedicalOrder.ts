export interface MedicalOrder{
    admission_no: string,
    admission_id: number,
    organization_id: number,
    patient_id: number,
    encounter_id: number,
    order_date: string,
    future_order_date: string,
    future_order_time: string,
    quantity: number,
    doctor_id: string,
    doctor_name: string,
    sales_item_id: number,
    sales_item_name: string,
    sales_item_type: string,
    is_process: boolean,
    cpoe_trans_id: string,
    item_type: string
}