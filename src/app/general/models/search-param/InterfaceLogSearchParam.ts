import { ComboBox } from "../ComboBox"

export interface InterfaceLogSearchParam {
    interface_type: ComboBox
    process_date_start: string,
    process_date_end: string,
    status: ComboBox,
    page_no: number
}

export class InterfaceLogSearchParam {
    static readonly PARAM_KEY = "interface-log-search-params"
}