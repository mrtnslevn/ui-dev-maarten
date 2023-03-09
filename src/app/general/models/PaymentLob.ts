export interface PaymentLob{
   key: string,
   value: string,
}

export class PaymentLob {
   static default(): PaymentLob {
      return { key: "", value: "All" };
   }
}