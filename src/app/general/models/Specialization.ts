export interface Specialization{
   image_url: string
   is_coe: boolean
   is_delete: boolean
   speciality_id: string
   speciality_name: string
   speciality_name_en: string
   speciality_seo_key: string
}

export class Specialization {
   static default(): Specialization {
      return {
         image_url: "",
         is_coe: false,
         is_delete: false,
         speciality_id: "",
         speciality_name: "",
         speciality_name_en: "",
         speciality_seo_key: ""
      }
   }
}