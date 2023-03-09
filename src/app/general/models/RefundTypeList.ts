export interface RefundTypeList{
    key: string,
    value: string,
 }
 
 export class RefundTypeList {
    static deafult(): RefundTypeList {
       return { key: "", value: "All" }
    }
 }