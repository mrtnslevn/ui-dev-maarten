export interface PaymentMode{
   key: string,
   value: string,
}

export class PaymentMode {
   static default(): PaymentMode {
      return { key: "", value: "" }
   }
}

export interface PaymentModePayment {
   bankTransfer: boolean,
   cash: boolean,
   depositIpd: boolean,
   digitalPayment: boolean,
   edc: boolean,
   giro: boolean,
   payer: boolean,
   prepaid: boolean,
   qris: boolean,
   voucher: boolean,
}

export class PaymentModePayment {
   static default(): PaymentModePayment {
      return {
         bankTransfer: false,
         cash: false,
         depositIpd: false,
         digitalPayment: false,
         edc: false,
         giro: false,
         payer: false,
         prepaid: false,
         qris: false,
         voucher: false,
      }
   }
}

export interface PaymentModeRefund {
   bankTransfer: boolean,
   cash: boolean,
   creditCard: boolean
}

export class PaymentModeRefund {
   static default(): PaymentModeRefund {
      return {
         bankTransfer: false,
         cash: false,
         creditCard: false
      }
   }
}