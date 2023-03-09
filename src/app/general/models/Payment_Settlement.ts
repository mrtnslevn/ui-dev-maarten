import {Paging} from "./Paging";

export interface Payment_Settlement {
  payment_mode_id: number;
  payment_mode_name: string;
  account_no: string;
  account_name: string;
  amount: number;
  notes: string;
  settlement_no: string;
  paging?: Paging;
}

export class Payment_Settlement {
  static default(): Payment_Settlement {
    return {
      payment_mode_id: 0,
      payment_mode_name: '',
      account_no: '',
      account_name: '',
      amount: 0,
      notes: '',
      settlement_no: '',
      paging: new Paging(0, 0, 0, 0, 0)
    }
  }

  static defaultArray(): Payment_Settlement[] {
    return [{
      payment_mode_id: 0,
      payment_mode_name: '',
      account_no: '',
      account_name: '',
      amount: 0,
      notes: '',
      settlement_no: '',
      paging: new Paging(0, 0, 0, 0, 0)
    }]
  }
}
