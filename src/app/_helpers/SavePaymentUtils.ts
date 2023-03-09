import { Bank_Transfer } from "src/app/general/models/div-card-payment/Bank_Transfer";
import { Cash } from "src/app/general/models/div-card-payment/Cash";
import { Digital_Payment } from "src/app/general/models/div-card-payment/Digital_Payment";
import { Edc } from "src/app/general/models/div-card-payment/Edc";
import { Giro } from "src/app/general/models/div-card-payment/Giro";
import { Payer } from "src/app/general/models/div-card-payment/Payer";
import { Qris } from "src/app/general/models/div-card-payment/Qris";
import { Patient } from "src/app/general/models/Patient";
import { BaseSavePaymentRequest, SavePaymentAdditionalPayer, SavePaymentBankTransfer, SavePaymentCard, SavePaymentCash, SavePaymentDigital, SavePaymentGiro, SavePaymentPrepaid, SavePaymentQris, SavePaymentRequest } from "src/app/general/models/request/SavePaymentReq";
import { PropertyCopier } from "src/app/_helpers/property-copier";
import { Prepaid } from "../general/models/div-card-payment/Prepaid";
import { PaymentModePayment } from "../general/models/PaymentMode";

export class SavePaymentUtils {
    static cash(formValid: PaymentModePayment, body: BaseSavePaymentRequest, cash: Cash) {
        if (formValid.cash) {
            const savePayment: SavePaymentCash = SavePaymentCash.default();
            PropertyCopier.copyProperties(cash, savePayment);
            body.cash = savePayment;
        }
    }

    static creditCard(formValid: PaymentModePayment, body: BaseSavePaymentRequest, card: Edc) {
        this.card(formValid, body, card, "Credit Card");
    }

    static debitCard(formValid: PaymentModePayment, body: BaseSavePaymentRequest, card: Edc) {
        this.card(formValid, body, card, "Debit Card");
    }

    static card(formValid: PaymentModePayment, body: BaseSavePaymentRequest, card: Edc, debitCreditType: string) {
        if (formValid.edc) {
            const savePayment: SavePaymentCard = SavePaymentCard.default();
            PropertyCopier.copyProperties(card, savePayment);
            savePayment.debit_credit_type = debitCreditType;
            body.notes = card.notes;
            body.card = savePayment;
        }
    }

    static chequeGiro(formValid: PaymentModePayment, body: BaseSavePaymentRequest, chequeGiro: Giro) {
        if (formValid.giro) {
            const savePayment: SavePaymentGiro = SavePaymentGiro.default();
            PropertyCopier.copyProperties(chequeGiro, savePayment);
            body.cheque_giro = savePayment;
            body.notes = chequeGiro.notes;
        }
    }

    static bankTransfer(formValid: PaymentModePayment, body: BaseSavePaymentRequest, bankTransfer: Bank_Transfer) {
        if (formValid.bankTransfer) {
            const savePayment: SavePaymentBankTransfer = SavePaymentBankTransfer.default();
            PropertyCopier.copyProperties(bankTransfer, savePayment);
            body.notes = bankTransfer.notes!;
            body.bank_transfer = savePayment;
        }
    }

    static additionalPayer(formValid: PaymentModePayment, body: BaseSavePaymentRequest, additionalPayer: Payer) {
        if (formValid.payer) {
            const savePayment: SavePaymentAdditionalPayer = SavePaymentAdditionalPayer.default();
            PropertyCopier.copyProperties(additionalPayer, savePayment);
            body.notes = additionalPayer.notes!;
            body.additional_payer = savePayment;
        }
    }

    static digitalPayment(formValid: PaymentModePayment, body: BaseSavePaymentRequest, digitalPayment: Digital_Payment,
        patientInfo: Patient) {
        if (formValid.digitalPayment) {
            const savePayment: SavePaymentDigital = SavePaymentDigital.default();
            PropertyCopier.copyProperties(digitalPayment, savePayment);
            body.notes = digitalPayment.notes;
            body.digital_payment = savePayment;
        }
    }

    static qris(formValid: PaymentModePayment, body: BaseSavePaymentRequest, qris: Qris, patientInfo: Patient) {
        if (formValid.qris) {
            const savePayment: SavePaymentQris = SavePaymentQris.default();
            PropertyCopier.copyProperties(qris, savePayment);
            savePayment.phone_no = patientInfo.contact_no;
            savePayment.customer_name = patientInfo.patient_name;
            body.qris = savePayment;
        }
    }

    static prepaid(formValid: PaymentModePayment, body: BaseSavePaymentRequest, prepaid: Prepaid) {
        if (formValid.prepaid) {
            const savePayment: SavePaymentPrepaid = SavePaymentPrepaid.default();
            PropertyCopier.copyProperties(prepaid, savePayment);
            body.notes = prepaid.notes;
            body.prepaid = savePayment;
        }
    }
}