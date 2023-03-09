import { GlobalResponse } from "../GlobalResponse";
;

export interface GetDepositorInfoResponse extends GlobalResponse{
    national_id_type_id?: number,
    national_id_no?: string,
    name?: string,
    email?: string,
    dob?: string,
    phone_no?: string,
    address?: string,
    identity_file_path?: string,
    national_id_type_name?: string,
    // relationship_with_patient_name?: string,
}