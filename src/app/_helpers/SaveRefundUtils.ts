import { Bank_Transfer } from "src/app/general/models/div-card-payment/Bank_Transfer";
import { Cash } from "src/app/general/models/div-card-payment/Cash";
import { Edc } from "src/app/general/models/div-card-payment/Edc";
import { BaseSavePaymentRequest, SavePaymentAdditionalPayer, SavePaymentBankTransfer, SavePaymentCard, SavePaymentCash, SavePaymentDigital, SavePaymentGiro, SavePaymentPrepaid, SavePaymentQris, SavePaymentRequest } from "src/app/general/models/request/SavePaymentReq";
import { PropertyCopier } from "src/app/_helpers/property-copier";
import { BankTransferRefund } from "../general/models/div-card-refund/BankTransferRefund";
import { CashRefund } from "../general/models/div-card-refund/CashRefund";
import { CreditCardRefund } from "../general/models/div-card-refund/CreditCardRefund";
import { PaymentModePayment } from "../general/models/PaymentMode";
import { SaveRefundBankTransfer, SaveRefundCash, SaveRefundCreditCard, SaveRefundRequest } from "../general/models/request/SaveRefundReq";

export class SaveRefundUtils {
    static cash(formValid: PaymentModePayment, body: SaveRefundRequest, cash: CashRefund) {
        if (formValid.cash) {
            const savePayment: SaveRefundCash = SaveRefundCash.default();
            PropertyCopier.copyProperties(cash, savePayment);
            body.cash = savePayment;
        }
    }

    static creditCard(formValid: PaymentModePayment, body: SaveRefundRequest, card: CreditCardRefund) {
        this.card(formValid, body, card, "Credit Card");
    }

    static card(formValid: PaymentModePayment, body: SaveRefundRequest, card: CreditCardRefund, debitCreditType: string) {
        if (formValid.edc) {
            const savePayment: SaveRefundCreditCard = SaveRefundCreditCard.default();
            PropertyCopier.copyProperties(card, savePayment);
            body.credit_card = savePayment;
        }
    }

    static bankTransfer(formValid: PaymentModePayment, body: SaveRefundRequest, bankTransfer: BankTransferRefund) {
        if (formValid.bankTransfer) {
            const savePayment: SaveRefundBankTransfer = SaveRefundBankTransfer.default();
            PropertyCopier.copyProperties(bankTransfer, savePayment);
            body.bank_transfer = savePayment;
        }
    }
}