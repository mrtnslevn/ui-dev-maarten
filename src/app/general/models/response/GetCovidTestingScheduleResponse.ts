import { CovidTestingSchedule } from "../CovidTestingSchedule";
import { GlobalResponse } from "../GlobalResponse";

export interface GetCovidTestingScheduleResponse extends GlobalResponse{
   schedule_list: CovidTestingSchedule[]
}