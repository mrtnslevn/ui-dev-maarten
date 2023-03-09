export interface DiscountType{
   key: string,
   value: string,
}

export class DiscountType {
   static default(): DiscountType {
      return {
         key: "",
         value: ""
      }
   }
}