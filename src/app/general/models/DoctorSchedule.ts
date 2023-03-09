export interface DoctorSchedule{
   schedule_id: string
   from_time: string
   to_time: string
   day: number
   day_name: string
   not_valid_before: string
   area_id: string
   speciality_id: string
   doctor_id: string
   hospital_id: string
   is_by_appointment: boolean
   is_allow_waiting_list: boolean
   consultation_type_id: string
   doctor_type_id: string
   quota: number
   is_full: boolean
   available_slot: number
}