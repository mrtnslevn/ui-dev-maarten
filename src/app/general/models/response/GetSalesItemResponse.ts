import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";
import { Uom } from "../Uom";

export interface GetSalesItemResponse extends GlobalResponse{
   sales_item_list: ItemList[],
   paging: Paging
}

export interface ItemList {
   sales_item_id: number,
   sales_item_name: string,
   sales_item_code: string,
   uom_list: Uom[]
}