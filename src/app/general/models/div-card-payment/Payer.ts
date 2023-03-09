export interface Payer {
  payer_id: number;
  payer_name: string;
  payer_id_no: string;
  eligibility_no: string;
  notes?: string;
}

export class Payer {
  static default(): Payer {
    return {
      payer_id: 0,
      payer_name: '',
      payer_id_no: '',
      eligibility_no: '',
      notes: ''
    }
  }
}