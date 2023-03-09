export interface AddSalesArItemTransactionDetailRequest {
    item_id: number,
    item_name: string,
    quantity: number,
    is_cito: number,
    notes: string,
    start_date: string,
    end_date?: string,
    cpoe_trans_id?: string,
    encounter_id?: number,
}