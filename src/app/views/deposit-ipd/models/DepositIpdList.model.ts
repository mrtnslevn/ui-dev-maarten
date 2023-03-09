export interface DepositIpdList {
    mr_no: number,
    org_id: number,
    deposit_amount: number,
    notes: string,
    last_deposit_date: string,
    patient_name: string,
    patient_id: number,
}

export interface DepositIpdListSearch {
    mr_no: number|string| undefined,
    last_transaction_date_from: string,
    last_transaction_date_to: string,
    patient_name: string | '',
    dob: string ,
    page_no: number,
}


export const DEPOSIT_IPD_LIST_SEARCH_KEY =  'deposit-ipd-list-params'