import {Payment_Mode} from "./enums/Payment_Mode";

export interface Payment {
  amount_to_settled: number;
  settle_amount: number;
  balance: number;
  deposit_balance: number;
  amount: number;
  payment_mode: Payment_Mode;
  net: number;
}

export class Payment {
  static default(): Payment {
    return {
      amount_to_settled: 0,
      settle_amount: 0,
      balance: 0,
      deposit_balance: 0,
      amount: 0,
      payment_mode: Payment_Mode.NONE,
      net: 0
    }
  }
}