import { GlobalResponse } from "../GlobalResponse";


export interface GetItemAndStockPriceResponse extends GlobalResponse {
   item_id: number;
   stock: number;
   price: number;
}