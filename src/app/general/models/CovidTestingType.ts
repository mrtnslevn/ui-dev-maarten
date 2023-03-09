export interface CovidTestingType{
   siloam_service_id: string
   name: string
   slug: string
   is_drive_thru: boolean
}

export class CovidTestingType {
   static default(): CovidTestingType {
      return {
         siloam_service_id: '',
         name: '',
         slug: '',
         is_drive_thru: false
      }
   }
 }