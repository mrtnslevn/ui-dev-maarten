import { Patient } from "../Patient";
import { PrepaidServiceList } from "../PrepaidServiceList";
import { PrepaidStatus } from "../PrepaidStatus";

export interface PrepaidListSearchParam {
    from_date: string,
    to_date: string,
    appointment_date: string,
    status: PrepaidStatus,
    booking_id: string,
    service: PrepaidServiceList,
    patient: Patient,
    page_no: number
}

export class PrepaidListSearchParam {
    static readonly PARAM_KEY = "prepaid-list-search-params"
}