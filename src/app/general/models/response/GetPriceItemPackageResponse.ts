import { GlobalResponse } from "../GlobalResponse";

export interface GetPriceItemPackageResponse extends GlobalResponse {
    stock: number,
    price: number
}