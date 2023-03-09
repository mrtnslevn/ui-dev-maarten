import { GlobalResponse } from "../GlobalResponse";

export interface AddSalesArItemIssueResponse extends GlobalResponse {
    ar_item_id: number,
    order_date: string,
    sales_order_id: number,
    sales_order_no: number
}