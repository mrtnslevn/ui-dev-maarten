export interface CovidTestingSchedule{
   checkup_schedule_id: string
   day: number
   day_name: string
   from_time: string
   to_time: string
   checkup_type_id: string
   checkup_id: string
   checkup_name: string
   checkup_date: string
}

export class CovidTestingSchedule {
   static default(): CovidTestingSchedule {
      return {
         checkup_schedule_id: '',
         day: 0,
         day_name: '',
         from_time: '',
         to_time: '',
         checkup_type_id: '',
         checkup_id: '',
         checkup_name: '',
         checkup_date: '',
      }
   }
 }