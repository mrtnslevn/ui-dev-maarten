import { DoctorSchedule } from "./DoctorSchedule"

export interface DoctorScheduleList{
   doctor_id: string
   doctor_name: string
   hospital_id: string
   hospital_name: string
   schedules: DoctorSchedule[]
}