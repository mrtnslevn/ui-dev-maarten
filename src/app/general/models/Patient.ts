export interface Patient {
  mr_no?: number;
  admission_id?: number,
  admission_no?: string;
  admission_date?: string;
  admission_sub_type?: string,
  patient_id?: number;
  payer_id?: number;
  patient_name?: string;
  patient_type?: string;
  payer_name?: string;
  address?: string;
  discharge_date?: string;
  city_name?: string;
  class_name?: string;

  notes?: string;
  primary_doctor?: string;
  primary_doctor_user_id?: number;
  bed?: string;
  email?: string;
  payer_id_no?: string;

  dob?: string;
  age?: number;
  sex?: string;
  id_no?: string;
  eligibility_no?: string;
  contact_no?: string;
  deposit_amount?: number;
  phone_no?: string;
  lob_id?: number
  nationality_id?: number,
  national_id_no: string,

  national_id_type_name: string,
  national_id_type_id?: number

  patient_type_id?: number,
  page_no?: number
}

export class Patient {
  static default(): Patient {
    return {
      mr_no: 0,
      admission_id: 0,
      admission_no: '',
      admission_date: '',
      admission_sub_type: '',
      patient_id: 0,
      payer_id: 0,
      patient_name: '',
      patient_type: '',
      payer_name: '',
      address: '',
      city_name: '',
      class_name: '',
  
      notes: '',
      primary_doctor: '',
      primary_doctor_user_id: 0,
      bed: '',
      email: '',
      payer_id_no: '',
  
      dob: '',
      age: 0,
      sex: '',
      id_no: '',
      eligibility_no: '',
      contact_no: '',
      deposit_amount: 0,
      phone_no: '',

      patient_type_id: 0,
      lob_id: 0,
      nationality_id: 0,
      national_id_no: '',
      national_id_type_name: '',
      national_id_type_id: 0
    }
  }

  static defaultWithoutMrNo(): Patient {
    return {
      admission_id: 0,
      admission_no: '',
      admission_date: '',
      admission_sub_type: '',
      patient_id: 0,
      payer_id: 0,
      patient_name: '',
      patient_type: '',
      payer_name: '',
      address: '',
      discharge_date: '',
      city_name: '',
      class_name: '',
  
      notes: '',
      primary_doctor: '',
      bed: '',
      email: '',
      payer_id_no: '',
  
      dob: '',
      age: 0,
      sex: '',
      id_no: '',
      eligibility_no: '',
      contact_no: '',
      deposit_amount: 0,
      phone_no: '',

      patient_type_id: 0,
      lob_id: 0,
      nationality_id: 0,
      national_id_no: '',
      national_id_type_name: '',
      national_id_type_id: 0
    }
  }
}