export interface PrepaidServiceList{
   key: string,
   value: string,
}

export class PrepaidServiceList {
   static default(): PrepaidServiceList {
      return { key: "", value: "All" }
   }
}