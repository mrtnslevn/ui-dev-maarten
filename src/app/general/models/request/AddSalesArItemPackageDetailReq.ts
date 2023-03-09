export interface AddSalesArItemPackageDetailRequest {
    item_id: number,
    // Tidak di pakai di backend, hanya digunakan untuk menampilkan pesan di ui
    item_name: string,
    quantity: number,
    notes: string
}