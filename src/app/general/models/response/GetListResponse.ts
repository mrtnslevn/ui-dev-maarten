import { GlobalResponse } from "../GlobalResponse";
import { PaymentLob } from "../PaymentLob";
import { PaymentStatus } from "../PaymentStatus";
import { PortionType } from "../PortionType";
import { PredefinedDiscount } from "../PredefinedDiscount";
import { SalesDiscountType } from "../SalesDiscountType";
import { SalesItemType } from "../SalesItemType";
import { TransactionLevel } from "../TransactionLevel";
import { DiscountType } from "../DiscountType";
import { SalesItemGroup } from "../SalesItemGroup";
import { CancelRejectReason } from "../CancelRejectReason";
import { PrepaidServiceList } from "../PrepaidServiceList";
import { EdcList } from "../EdcList";
import { PaymentMode } from "../PaymentMode";
import { BankList } from "../BankList";
import { BankAccountList } from "../BankAccountList";
import { PrepaidStatus } from "../PrepaidStatus";
import { AdmissionSubType } from "../AdmissionSubType";
import { ComboBox } from "../ComboBox";
import { InvoiceStatus } from "../InvoiceStatus";
import { SettlementStatus } from "../SettlementStatus";
import { PaymentModeListForDeposit } from "../PaymentModeListForDeposit";
import { NationalityType } from "../NationalityType";
import { RelationshipWithPatient } from "../RelationshipWithPatient";
import { RefundTypeList } from "../RefundTypeList";
import { PaymentModeForRefundList } from "../PaymentModeForRefundList";
import { RefundStatusList } from "../RefundStatusList";
import { FinalDischargeLob } from "../FinalDischargeLob";
import { Sex } from "../Sex";
import { IdentityType } from "../IdentityType";

export interface GetListResponse extends GlobalResponse {
   discountTransactionLevelList: TransactionLevel[],
   salesItemTypeList: SalesItemType[],
   salesDiscountTypeList: SalesDiscountType[],
   paymentLobList: PaymentLob[],
   admissionSubTypeList: AdmissionSubType[],
   paymentStatusList: PaymentStatus[],
   predefinedDiscountList: PredefinedDiscount[],
   portionTypeList: PortionType[],
   discountTypeList: DiscountType[],
   salesItemGroupList: SalesItemGroup[],
   cancelInvoiceRejectReasonList: CancelRejectReason[],
   cancelInvoiceRequestReasonList: CancelRejectReason[],
   cancelPaymentRequestReasonList: CancelRejectReason[],
   cancelSalesOrderRequestReasonList: CancelRejectReason[],
   prepaidServiceList: PrepaidServiceList[]
   edcList: EdcList[],
   paymentModeListForPayment: PaymentMode[],
   paymentModeListForPrepaid: PaymentMode[],
   bankList: BankList[],
   bankAccountList: BankAccountList[],
   prepaidStatusList: PrepaidStatus[],
   patientTypeList: ComboBox[]
   limitTypeList: ComboBox[],
   salesItemCategoryList: ComboBox[],
   interfaceTypeList: ComboBox[],
   interfaceLogStatusList: ComboBox[],
   invoiceStatusList: InvoiceStatus[],
   settlementStatusList: SettlementStatus[],
   genderList: Sex[],
   paymentModeListForDepositIpd: PaymentModeListForDeposit[],
   nationalityIdTypeList: NationalityType[],
   relationshipWithPatientIdList: RelationshipWithPatient[],
   refundTypeList: RefundTypeList[],
   paymentModeForRefundList: PaymentModeForRefundList[],
   refundStatus: RefundStatusList[],
   finalDischargeLobList: FinalDischargeLob[],
   refundDepositIPDRequestReasonList: IdentityType[],
}