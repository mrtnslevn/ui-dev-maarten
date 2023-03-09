export interface OpdDetail{
   doctor_id: string
   hospital_id: string
}

export class OpdDetail {
   static default(): OpdDetail {
      return {
         doctor_id: '',
         hospital_id: '',
      }
   }
 }