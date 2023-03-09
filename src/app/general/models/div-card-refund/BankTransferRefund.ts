export interface BankTransferRefund{
    bene_account_no: string
    bank_id: number
    bene_account_name: string
    refund_source_account_id : number
}

export class BankTransferRefund {
    static default(): BankTransferRefund {
      return {
        bene_account_no: '',
        bank_id: 0,
        bene_account_name: '',
        refund_source_account_id: 0
      }
    }
  }