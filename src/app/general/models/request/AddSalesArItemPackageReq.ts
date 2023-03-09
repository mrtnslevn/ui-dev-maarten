import { AddSalesArItemPackageDetailRequest } from "./AddSalesArItemPackageDetailReq";

export interface AddSalesArItemPackageRequest {
    organization_id: number,
    admission_id: number,
    // Tidak dipakai di backend, hanya untuk menampilkan pesan jika berhasil dan error
    admission_no: string,
    user_id: number,
    store_id?: number,
    doctor_user_id: number,
    email_type_id: number,
    email_address?: string,
    notes: string,
    list_package_item: AddSalesArItemPackageDetailRequest[]
}