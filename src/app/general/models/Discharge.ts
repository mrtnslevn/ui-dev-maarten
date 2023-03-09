import { SubDischarge } from "./SubDischarge"

export interface Discharge {
    discharge_id: number
    lob_id: number
    lob_name: string
    admission_no: string
    admission_id: number
    mr_no: number
    name: string
    birth_date: string
    admission_date: string
    discharge_date: string
    discharge_type: string
    sub_discharge_list: SubDischarge[]
}