import { PaymentLob } from "../PaymentLob";

export interface DischargeListSearchParam {
    lob: PaymentLob,
    admission_no: string,
    discharge_date_from: string,
    discharge_date_to: string,
    page_no: number,
    mr_no: number,
    patient_name: string,
}

export class DischargeListSearchParam {
    static readonly PARAM_KEY = "discharge-list-search-params"
}