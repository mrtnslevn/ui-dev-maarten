export interface PaymentModeListForDeposit{
    key: string,
    value: string,
 }
 
 export class PaymentModeListForDeposit {
    static default(): PaymentModeListForDeposit {
       return { key: "", value: "All" }
    }
 }
 
 export interface PaymentModeListForDepositPayment {
    bankTransfer: boolean,
    cash: boolean,
    edc: boolean,
    giro: boolean,
    prepaid: boolean,
    digitalPayment: boolean,
 }
 
 export class PaymentModeListForDepositPayment {
    static default(): PaymentModeListForDepositPayment {
       return {
          bankTransfer: false,
          cash: false,
          edc: false,
          giro: false,
          prepaid: false,
          digitalPayment: false,
       }
    }
 }