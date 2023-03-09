export interface PredefinedDiscount{
   key: string,
   value: string,
}

export class PredefinedDiscount {
   static default(): PredefinedDiscount {
      return {
         key: "",
         value: "",
      }
   }
}