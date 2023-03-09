export interface ReturnArItemIssueRequest {
    organization_id: number,
    sales_order_id: number,
    store_id: number,
    notes: string,
    returned_ar_items: ReturnedArItems[]
}

export interface ReturnedArItems {
    ar_item_id: number,
    uom_id: number,
    quantity: number
}