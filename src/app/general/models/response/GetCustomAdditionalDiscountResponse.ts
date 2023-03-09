import { AdditionalDiscount } from "../Additional_Discount";
import { GlobalResponse } from "../GlobalResponse";
import { Paging } from "../Paging";

export interface GetCustomAdditionalDiscountResponse extends GlobalResponse{
   custom_add_discount_list: AdditionalDiscount[]
   paging: Paging
}