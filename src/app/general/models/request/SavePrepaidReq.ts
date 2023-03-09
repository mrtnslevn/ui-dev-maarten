import { BookingInformation } from "../BookingInformation"

export interface SavePrepaidReq{
   gross: number
   service_type: string
   nationality_id: number
   prepaid_detail_list: BookingInformation[]
}