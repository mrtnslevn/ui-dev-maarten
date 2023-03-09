export interface Bank{
   key: string
   value: string
}

export class Bank {
   static default(): Bank {
      return {
         key: '',
         value: ''
      }
   }
}