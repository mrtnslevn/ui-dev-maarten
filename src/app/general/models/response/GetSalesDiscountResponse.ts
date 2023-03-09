import { GlobalResponse } from "../GlobalResponse";
import { Sales_Discount } from "../Sales_Discount";

export interface GetSalesDiscountResponse extends GlobalResponse{
   sales_discount_list: Sales_Discount[]
}  