export interface Invoice{
  invoice_no: string;
  invoice_id: number;
  invoice_date: string;

  payer_gross?: number;
  payer_admin?: number;
  payer_limit_type: string;
  payer_limit_factor?: number;
  payer_limit?: number;
  payer_discount_type: string;
  payer_discount_factor?: number;
  payer_discount?: number;
  payer_net: number;
  payer_balance: number;
  payer_round_amount?: number;

  patient_gross?: number;
  patient_admin?: number;
  patient_limit?: number;
  patient_discount_type: string;
  patient_discount_factor?: number;
  patient_discount?: number;
  promotion_code: string;
  patient_net: number;
  patient_balance: number;
  patient_round_amount?: number;

  total_gross?: number;
  total_discount?: number;
  total_admin?: number;
  total_rounding?: number;
  total_net: number;
  total_balance: number;

  cms_payer_limit_factor: number
  cms_patient_limit_factor: number
}

export class Invoice {
  static default(): Invoice {
    return {
      invoice_no: '',
      invoice_id: 0,
      invoice_date: '',
      total_gross: 0,
      total_admin: 0,
      total_rounding: 0,
      total_net: 0,
      total_balance: 0,
      total_discount: 0,

      payer_limit_type: '',
      payer_discount_type: '',
      payer_net: 0,
      payer_gross: 0,
      payer_balance: 0,
      payer_admin: 0,
      payer_limit_factor: 0,
      payer_limit: 0,
      payer_discount_factor: 0,
      payer_discount: 0,
  
      patient_discount_type: '',
      promotion_code: '',
      patient_net: 0,
      patient_balance: 0,
      patient_gross: 0,
      patient_admin: 0,
      patient_limit: 0,
      patient_discount: 0,
      patient_discount_factor: 0,

      cms_payer_limit_factor: 0,
      cms_patient_limit_factor: 0,
    }
  }
}