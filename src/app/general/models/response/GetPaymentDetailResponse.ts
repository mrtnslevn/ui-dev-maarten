import { GlobalResponse } from "../GlobalResponse";
import { SavePaymentAdditionalPayer, SavePaymentBankTransfer, SavePaymentCard, SavePaymentCash, SavePaymentDigital, SavePaymentGiro, SavePaymentPrepaid, SavePaymentQris } from "../request/SavePaymentReq";

export interface GetPaymentDetailResponse extends GlobalResponse {
    settlement_no: string,
    payment_mode_id: number,
    payment_mode_name: string,
    account_no: string,
    account_name: string,
    amount: number,
    notes: string,
    settlement_date: string,
    cash?: SavePaymentCash,
    card?: SavePaymentCard,
    digital_payment?: SavePaymentDigital,
    qris?: SavePaymentQris,
    cheque_giro?: SavePaymentGiro,
    bank_transfer?: SavePaymentBankTransfer,
    additional_payer?: SavePaymentAdditionalPayer,
    prepaid?: SavePaymentPrepaid   
}