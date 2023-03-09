export interface Prepaid {
  booking_id: string;
  booking_name: string;
  order_id: string;
  acquiring_bank: string;
  bank_number: string;
  card_assoc: string;
  card_no: string;
  customer_name: string;
  notes: string;
  payment_mode: string;
  amount: number;
}

export class Prepaid {
  static default(): Prepaid {
    return {
      booking_id: '',
      booking_name: '',
      order_id: '',
      acquiring_bank: '',
      bank_number: '',
      card_assoc: '',
      card_no: '',
      customer_name: '',
      notes: '',
      payment_mode: '',
      amount: 0,
    }
  }
}