import { GlobalResponse } from "../GlobalResponse";

export interface CreateAppointmentResponse extends GlobalResponse {
    appointment_hope_id: number,
    appointment_no: number,
    appointment_status_id: string,
    schedule_id: string,
    contact_id: string,
    reference_no: string,
    order_id: string,
    appointment_code: string,
}