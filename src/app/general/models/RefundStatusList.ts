export interface RefundStatusList{
    key: string,
    value: string,
 }
 
 export class RefundStatusList {
    static deafult(): RefundStatusList {
       return { key: "", value: "All" }
    }
 }