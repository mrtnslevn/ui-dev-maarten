import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { Uom } from "../Uom";

export interface GetSalesItemListResponse extends GlobalResponse {
   sales_item_list: ItemList[], 
   paging: Paging
}

export interface ItemList {
    sales_item_id: number,
    sales_item_name: string,
    sales_item_code: string,
    sales_item_type_id: number,
    sales_item_type_name: string,
    sales_item_category_id: string
    uom_list: Uom[]
}