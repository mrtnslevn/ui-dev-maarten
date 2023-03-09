export interface CovidTestDetail{
   hope_sales_item_category_id: string
   hope_sales_item_category: string
   checkup_type_id: string
   form_type: string
   form_type_id: string
   hospital_id: string
   hospital_hope_id: number
   country_code: string
   is_drive_thru: boolean
}

export class CovidTestDetail {
   static default(): CovidTestDetail {
      return {
         hope_sales_item_category_id: '',
         hope_sales_item_category: '',
         checkup_type_id: '',
         form_type: '',
         form_type_id: '',
         hospital_id: '',
         hospital_hope_id: 0,
         country_code: '',
         is_drive_thru: false
      }
   }
 }