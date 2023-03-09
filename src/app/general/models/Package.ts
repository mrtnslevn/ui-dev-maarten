export interface Package{
   sales_item_id: number
   sales_item_code: string
   sales_item_name: string
   price: number
   hope_sales_item_category_id: string
}

export class Package {
   static default(): Package {
      return {
         sales_item_id: 0,
         sales_item_code: '',
         sales_item_name: '',
         price: 0,
         hope_sales_item_category_id: ''
      }
   }
 }