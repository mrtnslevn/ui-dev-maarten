export interface PrepaidStatus{
   key: string,
   value: string,
}

export class PrepaidStatus {
   static deafult(): PrepaidStatus {
      return { key: "", value: "All" }
   }
}