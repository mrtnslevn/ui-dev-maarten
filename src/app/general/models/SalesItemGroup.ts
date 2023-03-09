export interface SalesItemGroup{
   key: string,
   value: string,
}

export class SalesItemGroup {
   static default(): SalesItemGroup {
      return {
         key: "",
         value: ""
      }
   }
}