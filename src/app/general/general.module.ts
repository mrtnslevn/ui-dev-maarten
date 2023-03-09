import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BadgeModule, ButtonModule, CardModule, FormModule, GridModule, SharedModule, SpinnerModule, TableModule, UtilitiesModule, AlertModule } from '@coreui/angular';
import { IconModule } from '@coreui/icons-angular';
import { CardAppComponent } from './general-card/card-app/card-app.component';
import { CardCombinedBillComponent } from './general-card/card-combined-bill/card-combined-bill.component';
import { CardPatientInfoComponent } from './general-card/card-patient-info/card-patient-info.component';
import { CardInvoiceComponent } from './general-card/card-invoice/card-invoice.component';
import { CardSalesDiscountComponent } from './general-card/card-sales-discount/card-sales-discount.component';
import { CardOrderedItemComponent } from './general-card/card-ordered-item/card-ordered-item.component';
import { CardPaymentSettlementComponent } from './general-card/card-payment-settlement/card-payment-settlement.component';
import { SelectPatientComponent } from './select-patient/select-patient.component';
import { DivCashComponent } from './div-card-payment/div-cash/div-cash.component';
import { DivEdcComponent } from './div-card-payment/div-edc/div-edc.component';
import { DivVoucherComponent } from './div-card-payment/div-voucher/div-voucher.component';
import { DivPayerComponent } from './div-card-payment/div-payer/div-payer.component';
import { DivDigitalPaymentComponent } from './div-card-payment/div-digital-payment/div-digital-payment.component';
import { DivBankTransferComponent } from './div-card-payment/div-bank-transfer/div-bank-transfer.component';
import { DivGiroComponent } from './div-card-payment/div-giro/div-giro.component';
import { DivQrisComponent } from './div-card-payment/div-qris/div-qris.component';
import { DivDepositIpdComponent } from './div-card-payment/div-deposit-ipd/div-deposit-ipd.component';
import { DivPrepaidComponent } from './div-card-payment/div-prepaid/div-prepaid.component';
import { CardSearchPaymentComponent } from './general-card/card-search-payment/card-search-payment.component';
import { CardCancelReasonComponent } from './general-card/card-cancel-reason/card-cancel-reason.component';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ModalSearchPatientComponent } from './general-modal/modal-search-patient/modal-search-patient.component';
import { ModalSearchPayerComponent } from './general-modal/modal-search-payer/modal-search-payer.component';
import { ModalCancelComponent } from './general-modal/modal-cancel/modal-cancel.component';
import { ModalRejectReasonComponent } from './general-modal/modal-reject-reason/modal-reject-reason.component';
import { ModalPaymentTypeComponent } from './general-modal/modal-payment-type/modal-payment-type.component';
import { ModalCustomAdditionalDiscountComponent } from './general-modal/modal-custom-additional-discount/modal-custom-additional-discount.component';
import { ModalAddSalesItemComponent } from './general-modal/modal-add-sales-item/modal-add-sales-item.component';
import { ModalSearchSalesItemComponent } from './general-modal/modal-search-sales-item/modal-search-sales-item.component';
import { ModalReturnSalesItemComponent } from './general-modal/modal-return-sales-item/modal-return-sales-item.component';
import { ModalSendPrintComponent } from './general-modal/modal-send-print/modal-send-print.component';
import { ModalMedicalOrderComponent } from './general-modal/modal-medical-order/modal-medical-order.component';
import { CardInputSalesDiscountComponent } from './general-card/card-input-sales-discount/card-input-sales-discount.component';
import { ModalAddCustomAdditionalDiscountComponent } from './general-modal/modal-add-custom-additional-discount/modal-add-custom-additional-discount.component';
import { ModalOrderedItemComponent } from './general-modal/modal-ordered-item/modal-ordered-item.component';
import { ModalAlertComponent } from './general-modal/modal-alert/modal-alert.component';
import { TableMedicalOrderComponent } from './table-medical-order/table-medical-order.component';
import { ModalPackageComponent } from './general-modal/modal-package/modal-package.component';
import { ModalViewScheduleDoctorComponent } from './general-modal/modal-view-schedule-doctor/modal-view-schedule-doctor.component';
import { NumericDirective } from '../directive/numeric.directive';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxContextModule } from 'ngx-context';
import { ModalValidasiUserComponent } from './general-modal/modal-validasi-user/modal-validasi-user.component';
import { ModalAlertConfirmComponent } from './general-modal/modal-alert-confirm/modal-alert-confirm.component';
import { ModalMedicalOrderTransactionComponent } from './general-modal/modal-medical-order-transaction/modal-medical-order-transaction.component';
import { TableMedicalOrderTransactionComponent } from './table-medical-order-transaction/table-medical-order-transaction.component';
import { CardDepositorComponent } from './general-card/card-depositor/card-depositor.component';
import { CardRefundDepositApprovalDetailComponent } from './general-card/card-refund-deposit-approval-detail/card-refund-deposit-approval-detail.component';
import { CardDepositIpdPaymentSettlementComponent } from './general-card/card-deposit-ipd-payment-settlement/card-deposit-ipd-payment-settlement.component';
import { CardPatientInfoDepositComponent } from './general-card/card-patient-info-deposit/card-patient-info-deposit.component';
import { CardPatientInfoPrepaidComponent } from './general-card/card-patient-info-prepaid/card-patient-info-prepaid.component';
import { ModalSendPrintDepositComponent } from './general-modal/modal-send-print-deposit/modal-send-print-deposit.component';
import { ModalDocumentViewComponent } from './general-modal/modal-document-view/modal-document-view.component';
import { CardDepositIpdHistoryComponent } from './general-card/card-deposit-ipd-history/card-deposit-ipd-history.component';
import { CardDocumentComponent } from './general-card/card-document/card-document.component';
import { CardRefundDepositComponent } from './general-card/card-refund-deposit/card-refund-deposit.component';
import { CardDepositPrepaidHistoryComponent } from './general-card/card-deposit-prepaid-history/card-deposit-prepaid-history.component';
import { ModalRejectAcceptRevisionRefundComponent } from './general-modal/modal-reject-accept-revision-refund/modal-reject-accept-revision-refund.component';
import { DivCashRefundComponent } from './div-card-refund/div-cash-refund/div-cash-refund.component';
import { DivBankTransferRefundComponent } from './div-card-refund/div-bank-transfer-refund/div-bank-transfer-refund.component';
import { DivCreditCardRefundComponent } from './div-card-refund/div-credit-card-refund/div-credit-card-refund.component';

@NgModule({
  declarations: [
    CardAppComponent,
    CardCombinedBillComponent,
    CardPatientInfoComponent,
    CardInvoiceComponent,
    CardSalesDiscountComponent,
    CardOrderedItemComponent,
    CardPaymentSettlementComponent,
    SelectPatientComponent,
    DivCashComponent,
    DivEdcComponent,
    DivVoucherComponent,
    DivPayerComponent,
    DivDigitalPaymentComponent,
    DivBankTransferComponent,
    DivGiroComponent,
    DivQrisComponent,
    DivDepositIpdComponent,
    DivPrepaidComponent,
    CardSearchPaymentComponent,
    CardCancelReasonComponent,
    ModalSearchPatientComponent,
    ModalSearchPayerComponent,
    ModalCancelComponent,
    ModalRejectReasonComponent,
    ModalPaymentTypeComponent,
    ModalCustomAdditionalDiscountComponent,
    ModalAddSalesItemComponent,
    ModalSearchSalesItemComponent,
    ModalReturnSalesItemComponent,
    CardInputSalesDiscountComponent,
    ModalAddCustomAdditionalDiscountComponent,
    ModalOrderedItemComponent,
    ModalSendPrintComponent,
    ModalMedicalOrderComponent,
    ModalMedicalOrderTransactionComponent,
    CardInputSalesDiscountComponent,
    ModalAddCustomAdditionalDiscountComponent,
    ModalOrderedItemComponent,
    ModalAlertComponent,
    TableMedicalOrderComponent,
    TableMedicalOrderTransactionComponent,
    ModalPackageComponent,
    ModalViewScheduleDoctorComponent,
    NumericDirective,
    ModalValidasiUserComponent,
    ModalAlertConfirmComponent,
    CardDepositorComponent,
    CardRefundDepositApprovalDetailComponent,
    CardDepositIpdPaymentSettlementComponent,
    CardPatientInfoDepositComponent,
    CardPatientInfoPrepaidComponent,
    CardDepositIpdHistoryComponent,
    CardDocumentComponent,
    CardRefundDepositComponent,
    CardDepositPrepaidHistoryComponent,
    CardRefundDepositApprovalDetailComponent,
    CardDepositIpdPaymentSettlementComponent,
    CardPatientInfoDepositComponent,
    CardPatientInfoPrepaidComponent,
    ModalSendPrintDepositComponent,
    ModalDocumentViewComponent,
    ModalRejectAcceptRevisionRefundComponent,
    DivCashRefundComponent,
    DivBankTransferRefundComponent,
    DivCreditCardRefundComponent,
  ],
  imports: [
    PaginationModule.forRoot(),
    CommonModule,
    ButtonModule,
    CardModule,
    FormsModule,
    FormModule,
    GridModule,
    IconModule,
    SharedModule,
    UtilitiesModule,
    TableModule,
    SpinnerModule,
    AlertModule,
    ReactiveFormsModule,
    NgSelectModule,
    NgxContextModule
  ],
  exports: [
    CardAppComponent,
    CardCombinedBillComponent,
    CardPatientInfoComponent,
    CardInvoiceComponent,
    CardSalesDiscountComponent,
    CardOrderedItemComponent,
    CardPaymentSettlementComponent,
    CardSearchPaymentComponent,
    CardDepositorComponent,
    CardDepositIpdPaymentSettlementComponent,
    CardRefundDepositApprovalDetailComponent,
    CardPatientInfoDepositComponent,
    CardPatientInfoPrepaidComponent,
    CardDepositIpdHistoryComponent,
    CardDepositPrepaidHistoryComponent,
    CardDocumentComponent,
    CardRefundDepositComponent,
    CardRefundDepositApprovalDetailComponent,
    CardDepositIpdPaymentSettlementComponent,
    CardPatientInfoDepositComponent,
    CardPatientInfoPrepaidComponent,
    SelectPatientComponent,
    DivCashComponent,
    DivEdcComponent,
    DivVoucherComponent,
    DivPayerComponent,
    DivDigitalPaymentComponent,
    DivBankTransferComponent,
    DivGiroComponent,
    DivQrisComponent,
    DivDepositIpdComponent,
    DivPrepaidComponent,
    CardCancelReasonComponent,
    CommonModule,
    AlertModule,
    ButtonModule,
    CardModule,
    FormsModule,
    FormModule,
    GridModule,
    IconModule,
    SharedModule,
    UtilitiesModule,
    TableModule,
    ModalSearchPatientComponent,
    ModalSearchPayerComponent,
    ModalCancelComponent,
    ModalRejectReasonComponent,
    ModalPaymentTypeComponent,
    ModalCustomAdditionalDiscountComponent,
    ModalAddSalesItemComponent,
    ModalSearchSalesItemComponent,
    ModalReturnSalesItemComponent,
    CardInputSalesDiscountComponent,
    ModalOrderedItemComponent,
    ModalMedicalOrderComponent,
    ModalMedicalOrderTransactionComponent,
    ModalSendPrintComponent,
    ModalSendPrintDepositComponent,
    ModalDocumentViewComponent,
    CardInputSalesDiscountComponent,
    ModalOrderedItemComponent,
    SpinnerModule,
    BadgeModule,
    ReactiveFormsModule, 
    TableMedicalOrderComponent,
    TableMedicalOrderTransactionComponent,
    NumericDirective,
    DivCashRefundComponent,
    DivBankTransferRefundComponent,
    DivCreditCardRefundComponent
  ]
})

export class GeneralModule { }
