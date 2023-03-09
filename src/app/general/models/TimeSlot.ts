export interface TimeSlot {
    no: number,
    appointment_range_time: string,
    schedule_id: string,
    consultation_type_id: string,
    doctor_type_id: string,
    hospital_id: string,
    hospital_time_zone: number,
    schedule_from_time: string,
    schedule_to_time: string,
    appointment_no: number,
    is_walkin: boolean,
    is_available: boolean,
    is_blocked: boolean,
    appointment_date: string,
    is_reserved_slot: boolean,
    appointment_id: string,
    day: number,
    is_full: boolean,
    count_slot: number,
    time_slot_min_number: number
}