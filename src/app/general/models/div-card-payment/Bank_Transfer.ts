export interface Bank_Transfer {
  bank_id: number;
  bank_name: string;
  account_no: string;
  account_name: string;
  transfer_date: string;
  reference_no: string;
  receipt_bank_acc_id: number;
  receipt_bank_acc_name: string;
  notes?: string;
}

export class Bank_Transfer {
  static default(): Bank_Transfer {
    return {
      bank_id: 0,
      bank_name: '',
      account_no: '',
      account_name: '',
      transfer_date: '',
      reference_no: '',
      receipt_bank_acc_id: 0,
      receipt_bank_acc_name: '',
      notes: ''
    }
  }
}