export interface CombinedBill {
  admission_id: number,
  admission_type: string;
  admission_sub_type: string;
  payer_name: string;
  admission_no: string;
  admission_date: string;
  mr_no: number;
  patient_id: number;
  patient_name: string;
  lob_id: number;
  city: string;
  address: string;
  sex: string;
  checked?: boolean;
  dob: string,
}

export class CombinedBill {
  static default(): CombinedBill {
    return {
      admission_id: 0,
      admission_type: '',
      admission_sub_type: '',
      payer_name: '',
      admission_no: '',
      admission_date: '',
      mr_no: 0,
      patient_id: 0,
      patient_name: '',
      city: '',
      address: '',
      sex: '',
      lob_id: 0,
      dob: ''
    }
  }
}