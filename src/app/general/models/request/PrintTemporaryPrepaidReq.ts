import { BookingInformation } from "../BookingInformation"

export interface PrintTemporaryPrepaidRequest {
    prepaid_list: BookingInformation[]
    nationality_id?: number
    discount?: number
    notes?: string
}