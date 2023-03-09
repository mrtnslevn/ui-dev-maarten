export interface PrintTemporaryInvoiceRequest {
    admission: PrintTemporaryInvoiceAdmission,
    invoice: PrintTemporaryInvoiceData
    nationality_id: number
    notes: string
}

export interface PrintTemporaryInvoiceAdmission {
    mr_no: number,
    admission_no: string,
    admission_date: string,
    discharge_date: string,
    patient_name: string,
    patient_type: string,
    payer_name: string,
    primary_doctor: string,
    bed: string,
    class_name: string,
    lob_id: number,
    company_name: string,
    npwp: string,
    address: string
}

export interface PrintTemporaryInvoiceData {
    payer_admin: number,
    payer_net: number,
    payer_balance: number,
    patient_admin: number,
    patient_net: number,
    patient_balance: number,
    ordered_item_list: PrintTemporaryInvoiceOrderedItem[]
}

export interface PrintTemporaryInvoiceOrderedItem {
    sales_item_type_name: string,
    sales_item_name: string,
    qty: number,
    uom: string,
    description: string,
    amount: number,
    discount: number,
    patient_net: number,
    payer_net: number
}

export class PrintTemporaryInvoiceAdmission {
    static default(): PrintTemporaryInvoiceAdmission {
        return {
            mr_no: 0,
            admission_no: '',
            admission_date: '',
            discharge_date: '',
            patient_name: '',
            patient_type: '',
            payer_name: '',
            primary_doctor: '',
            bed: '',
            class_name: '',
            lob_id: 0,
            company_name: '',
            npwp: '',
            address: ''
        }
    }
}

export class PrintTemporaryInvoiceData {
    static default(): PrintTemporaryInvoiceData {
        return {
            payer_admin: 0,
            payer_net: 0,
            payer_balance: 0,
            patient_admin: 0,
            patient_net: 0,
            patient_balance: 0,
            ordered_item_list: []
        }
    }
}

export class PrintTemporaryInvoiceOrderedItem {
    static default(): PrintTemporaryInvoiceOrderedItem {
        return {
            sales_item_type_name: '',
            sales_item_name: '',
            qty: 0,
            uom: '',
            description: '',
            amount: 0,
            discount: 0,
            patient_net: 0,
            payer_net: 0
        }
    }
}