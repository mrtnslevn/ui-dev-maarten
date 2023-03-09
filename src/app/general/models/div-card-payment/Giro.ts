export interface Giro {
  bank_id: number;
  bank_name: string;
  cheque_no: string;
  cheque_date: string;
  notes?: string;
}

export class Giro {
  static default(): Giro {
    return {
      bank_id: 0,
      bank_name: '',
      cheque_no: '',
      cheque_date: '',
      notes: ''
    }
  }
}
