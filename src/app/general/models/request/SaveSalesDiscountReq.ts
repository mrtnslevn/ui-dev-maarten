import { CustomAdditionalDiscount } from "../Additional_Discount";

export interface SaveSalesDiscount {
    admission_id: number,
    admission_no: string,
    sales_discount_type_id: number,
    predefined_discount_id?: number,
    predefined_discount_name?: string,
    custom_add_discount_list?: CustomAdditionalDiscount[]
}