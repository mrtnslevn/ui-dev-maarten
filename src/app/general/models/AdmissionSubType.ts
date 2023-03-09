export interface AdmissionSubType {
    admission_sub_type_id: number,
    admission_sub_type_code: string,
    admission_sub_type_name: string,
    lob_id: number
}

export class AdmissionSubType {
    static default(): AdmissionSubType {
        return {
            admission_sub_type_id: 0,
            admission_sub_type_code: "",
            admission_sub_type_name: "All",
            lob_id: 0
        }
    }
 }