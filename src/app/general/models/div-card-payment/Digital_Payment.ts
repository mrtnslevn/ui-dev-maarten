export interface Digital_Payment {
  whatsapp_no?: string;
  email?: string;
  payment_code: string;
  transaction_id: string;
  payment_type: string;
  acquiring_bank: string;
  bank_number: string;
  card_assoc: string;
  card_no: string;
  customer_name: string;
  notes: string;
  paid_status: boolean;
}

export class Digital_Payment {
  static default(): Digital_Payment {
    return {
      payment_code: '',
      transaction_id: '',
      payment_type: '',
      acquiring_bank: '',
      bank_number: '',
      card_assoc: '',
      card_no: '',
      customer_name: '',
      notes: '',
      paid_status: false
    }
  }
}