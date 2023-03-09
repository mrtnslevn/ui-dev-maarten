export interface PaymentStatus{
   key: string,
   value: string,
}

export class PaymentStatus {
   static default(): PaymentStatus {
      return { key: "", value: "All" };
   }
}