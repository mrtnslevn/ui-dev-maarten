import { GlobalResponse } from "../GlobalResponse";
import { TimeSlotList } from "../TimeSlotList";

export interface GetTimeSlotResponse extends GlobalResponse {
    time_slot_list: TimeSlotList[]
}