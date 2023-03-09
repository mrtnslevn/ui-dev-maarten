import { SalesItemList } from "./SalesItemList"

export interface SalesItemTypeList {
   sales_item_type_id: number,
   sales_item_type_name: string,
   email_to_enabled: string,
   email_to: string,
   is_item_issue: string
   sales_item_list: Array<SalesItemList>
}