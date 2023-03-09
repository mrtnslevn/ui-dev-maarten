import { GlobalResponse } from "../GlobalResponse"

export interface SavePrepaidResponse extends GlobalResponse{
   booking_id_list: []
   prepaid_id: string
   prepaid_date: string
}