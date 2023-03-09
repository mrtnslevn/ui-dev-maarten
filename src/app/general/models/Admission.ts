export interface Admission {
    admission_id: number,
    admission_type: string,
    admission_sub_type: string,
    payer_id: number,
    payer_name: string,
    admission_no: string,
    admission_date: string,
    mr_no: number,
    patient_name: string,
    address: string,
    city: string,
    dob: string,
    sex: string,
    lob_id: number,
    checked?: boolean
}

export class Admission {
    static default(): Admission {
        return {
            admission_id: 0,
            admission_type: "",
            admission_sub_type: "",
            payer_id: 0,
            payer_name: "",
            admission_no: "",
            admission_date: "",
            mr_no: 0,
            patient_name: "",
            address: "",
            city: "",
            dob: "",
            sex: "",
            lob_id: 0
        }
    }
}