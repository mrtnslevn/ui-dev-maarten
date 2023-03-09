import { GlobalResponse } from "../GlobalResponse";

export interface GetItemStockandPriceResponse extends GlobalResponse {
   item_id: number
   stock: number
   price: number
}