import { DoctorSchedule } from "../DoctorSchedule";
import { GlobalResponse } from "../GlobalResponse";
import { DoctorScheduleList } from "../DoctorScheduleList";

export interface GetScheduledDoctorResponse extends GlobalResponse{
   scheduled_doctor_list: DoctorScheduleList[]
}