export interface Edc {
  merchant_id: string;
  card_no: string;
  card_holder_name: string;
  bank: string;
  bank_id: number,
  approval_code: string;
  transaction_id: string;
  card_expiry_date: string;
  notes: string;
  edc_id?: number;
  edc_name?: string;
  card_type?: string,
  reference_no: string,
  paid_status: boolean,
  is_integrated: string
}

export class Edc {
  static default(): Edc {
    return {
      merchant_id: '',
      card_no: '',
      card_holder_name: '',
      bank: '',
      bank_id: 0,
      approval_code: '',
      transaction_id: '',
      card_expiry_date: '',
      notes: '',
      card_type: '',
      reference_no: '',
      paid_status: false,
      is_integrated: ''
    }
  }
}