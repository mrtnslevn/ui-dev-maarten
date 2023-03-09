import { GlobalResponse } from "../GlobalResponse";
import { OrderedItemType } from "../OrderedItemType";

export interface GetOrderedItemResponse extends GlobalResponse {
    sales_item_type_list: OrderedItemType[]
}