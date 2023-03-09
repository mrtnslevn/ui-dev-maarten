import { Patient } from "../Patient";
import { Sex } from "../Sex";

export interface DepositIpdPaymentSearchParam {
    dob: string,
    id_no: number,
    sex: Sex,
    page_no: number,
    mr_no: number,
    patient_name: string,
    age?: number,
    address?: string,
    email?: string,
    phone_no?: string,
    deposit_amount?: number,
}

export class DepositIpdPaymentSearchParam {
    static readonly PARAM_KEY = "deposit-ipd-payment-search-params"
}