export interface MidtransPaymentReq {
    transaction_type: string,
    transaction_no: string,
    billing_date: string | undefined,
    amount: number,
    first_name?: string
    last_name?: string,
    email: string,
    phone: string,
    address?: string,
    city?: string,
    postal_code?: string,
    country_code?: string,
    organization_name: string
}