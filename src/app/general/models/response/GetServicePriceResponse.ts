import { GlobalResponse } from "../GlobalResponse";

export interface GetServicePriceResponse extends GlobalResponse {
    item_id: number,
    price: number,
    stock: number
}