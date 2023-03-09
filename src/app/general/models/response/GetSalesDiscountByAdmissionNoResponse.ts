import { AdditionalDiscount } from "../Additional_Discount";
import { GlobalResponse } from "../GlobalResponse";

export interface GetSalesDiscountByAdmissionNoResponse extends GlobalResponse {
    sales_discount_type_id: number,
    sales_discount_type_name: string,
    predefined_discount_id: number,
    predefined_discount_name: string,
    custom_add_discount_list: AdditionalDiscount[]
}