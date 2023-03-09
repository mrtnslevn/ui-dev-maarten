export interface SettlementStatus{
    key: string,
    value: string,
 }
 
 export class SettlementStatus {
    static default(): SettlementStatus {
       return { key: "", value: "All" };
    }
 }