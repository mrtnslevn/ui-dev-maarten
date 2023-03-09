export interface SavePrepaidInvoiceReq{
   prepaid_id: string,
   discount_type_id: number,
   discount_factor: number,
   discount_amount: number,
   promotion_code: string,
   net: number,
   rounding: number,
   balance: number,
}