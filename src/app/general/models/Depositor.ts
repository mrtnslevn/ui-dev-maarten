export interface Depositor{
    national_id_type_id?: number,
    national_id_type_name?: string,
    national_id_no?: string,
    name: string,
    email: string,
    dob: string,
    address?: string,
    phone_no?: string,
    relationship_with_patient_id: number,
    relationship_with_patient_name: string,
    identity_filestr: string,
    file_extension: string,
    is_patient: boolean,
}

export class Depositor {
    static default(): Depositor {
        return {
            national_id_type_id: 0,
            national_id_type_name: "",
            national_id_no: "",
            name: "",
            email: "",
            dob: "",
            address: "",
            phone_no: "",
            relationship_with_patient_id: 0,
            relationship_with_patient_name: "",
            identity_filestr: "",
            file_extension: "",
            is_patient: false,
        }
    }
}