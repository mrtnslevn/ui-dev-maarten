import { AdditionalDiscount } from "./Additional_Discount";

export interface Sales_Discount {
  admission_no: string;
  sales_discount_type_id: string;
  sales_discount_type_name: string;
  predefined_discount_id: string;
  predefined_discount_name: string;
  custom_add_discount_list?: Array<AdditionalDiscount>;
}
