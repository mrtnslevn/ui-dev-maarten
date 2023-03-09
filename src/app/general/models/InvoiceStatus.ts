export interface InvoiceStatus{
    key: string,
    value: string,
 }
 
 export class InvoiceStatus {
    static default(): InvoiceStatus {
       return { key: "", value: "All" };
    }
 }