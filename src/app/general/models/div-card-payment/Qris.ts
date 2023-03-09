export interface Qris {
  settlement_no?: string;
  qris?: string;
  transaction_id: string;
  customer_name: string;
  phone_no: string;
  issuer: string;
  payment_date: string;
  approval_code: string;
  notes: string;
}

export class Qris {
  static default(): Qris {
    return {
      settlement_no: '',
      qris: '',
      transaction_id: '',
      customer_name: '',
      phone_no: '',
      issuer: '',
      payment_date: '',
      approval_code: '',
      notes: '',
    }
  }
}
