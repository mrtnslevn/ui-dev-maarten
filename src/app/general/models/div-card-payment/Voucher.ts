export interface Voucher {
  voucher_no: string;
  voucher_code: string;
  voucher_name: string;
  voucher_type: string;
  amount: number;
  notes?: string;
}
