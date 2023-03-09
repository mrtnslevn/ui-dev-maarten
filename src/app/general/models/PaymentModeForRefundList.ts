export interface PaymentModeForRefundList{
    key: string,
    value: string,
 }
 
 export class PaymentModeForRefundList {
    static deafult(): PaymentModeForRefundList {
       return { key: "", value: "All" }
    }
 }