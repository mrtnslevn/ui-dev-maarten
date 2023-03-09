export interface SalesItemType{
    sales_item_type_id: number,
    sales_item_type_name: string,
    is_item_issue: string
}

export class SalesItemType {
    static default(): SalesItemType {
        return {
            sales_item_type_id: 0,
            sales_item_type_name: "",
            is_item_issue: ""
        }
    }
}