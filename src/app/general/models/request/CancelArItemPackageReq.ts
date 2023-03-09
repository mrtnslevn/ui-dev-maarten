export interface CancelArItemPackageRequest {
    organization_id: number,
    admission_id: number,
    cancel_user_id: number,
    cancel_notes: string,
    cancel_reason_id: number,
    sales_order_id: number,
    // tidak dipakai di backend, hanya untuk alert saja
    sales_item_name: string,
    ar_item_id: number
}