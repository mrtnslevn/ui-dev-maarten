export interface CreateAppointmentRequest {
    appointment_date: string,
    appointment_from_time: string,
    appointment_no: number,
    appointment_to_time: string,
    birth_date: string,
    contact_id: string,
    doctor_id: string,
    email_address: string,
    hospital_id: string,
    is_waiting_list: boolean,
    name: string,
    contact_no: string,
    schedule_id: string,
    is_prepaid: boolean,
    confirmation_code: string,
    order_id: string,
    registration_form_id: string
}