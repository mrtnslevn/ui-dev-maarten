export interface Uom {
   uom_id: number,
   uom_name: string,
   uom_ratio?: number
}

export class Uom {
   static default(): Uom {
      return {
         uom_id: 0,
         uom_name: '',
      }
   }
}