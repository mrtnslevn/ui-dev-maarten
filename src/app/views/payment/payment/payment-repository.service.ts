import { HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BsModalRef } from "ngx-bootstrap/modal";
import { AdmissionSubType } from "src/app/general/models/AdmissionSubType";
import { OrderedItemType } from "src/app/general/models/OrderedItemType";
import { Patient } from "src/app/general/models/Patient";
import { PaymentLob } from "src/app/general/models/PaymentLob";
import { PaymentMode } from "src/app/general/models/PaymentMode";
import { GetBillingRequest } from "src/app/general/models/request/GetBillingReq";
import { SavePaymentRequest } from "src/app/general/models/request/SavePaymentReq";
import { GetAdmissionDetailResponse } from "src/app/general/models/response/GetAdmissionDetailResponse";
import { GetAdmissionListResponse } from "src/app/general/models/response/GetAdmissionListResponse";
import { GetBillingResponse } from "src/app/general/models/response/GetBillingResponse";
import { GetEdcDetailResponse } from "src/app/general/models/response/GetEdcDetailResponse";
import { GetListResponse } from "src/app/general/models/response/GetListResponse";
import { GetPatientListResponse } from "src/app/general/models/response/GetPatientListResponse";
import { SavePaymentResponse } from "src/app/general/models/response/SavePaymentResponse";
import { GeneralService } from "src/app/service/general.service";
import { ModalAlertService } from "src/app/service/modal-alert.service";
import { PaymentService } from "src/app/service/payment.service";
import { ALERT_DANGER, RESPONSE_SUCCESS } from "src/app/_configs/app-config";
import { PropertyCopier } from "src/app/_helpers/property-copier";
import { PaymentComponent } from "./payment.component";

@Injectable({
  providedIn: 'root'
})
export class PaymentRepository {
  component!: PaymentComponent;
  bsModalShowAlert?: BsModalRef

  private getListResponse!: GetListResponse;
  private getAdmissionListResponse!: GetAdmissionListResponse;
  private getAdmissionDetailResponse!: GetAdmissionDetailResponse;
  private getPatientListResponse!: GetPatientListResponse;
  private getBillingResponse!: GetBillingResponse;
  private savePaymentResponse!: SavePaymentResponse;
  private getEdcDetailResponse!: GetEdcDetailResponse;

  constructor(private paymentService: PaymentService, private generalService: GeneralService,
    private alertService: ModalAlertService) { }
  
  getList(): void {
    const params = new HttpParams().set('param_list', "paymentLobList")
    .append("param_list", "paymentModeListForPayment").append("param_list", "admissionSubTypeList");

    this.paymentService.getList(params)
    .subscribe((data: GetListResponse) => {
      this.getListResponse = {...data}
      if (this.getListResponse.response_code == RESPONSE_SUCCESS) {
        this.getListResponse.paymentLobList.forEach((l: PaymentLob) => {
          this.component.listLob.push(l);
        });
        this.getListResponse.admissionSubTypeList.forEach((a: AdmissionSubType) => {
          this.component.listAdmissionSubType.push(a);
        })
        this.getListResponse.paymentModeListForPayment.forEach((p: PaymentMode) => {
          this.component.paymentModeList.push(p);
        })
      } else {
        this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
      }
      this.component.loadPage = false;
    }, (err: any) => {
      this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
      this.component.loadPage = false;
    })
  }

  getAdmissionList(): void {
    this.component.progress = true;
    this.paymentService.getAdmissionList(this.component.params)
    .subscribe((data: GetAdmissionListResponse) => {
      this.getAdmissionListResponse = {...data};
      if (this.getAdmissionListResponse.response_code == RESPONSE_SUCCESS) {
        this.component.admissionList = data.admission_list;
        this.component.admissionList.forEach((i: any) => {
          i.checked = false;
        });

        if(this.component.stateAdmissionNo!=''){
          this.component.admissionList[0].checked = true
          this.component.addBill()
        }
      } else {
        this.alertService.showModalAlert(`Failed to get admisssion list: ${this.getAdmissionListResponse.response_desc}`,ALERT_DANGER)
      }     
      this.component.progress = false;
      this.component.search = true;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get admisiion list, please contact administration`, ALERT_DANGER)
      this.component.progress = false;
      this.component.search = false;
    })
  }

  getPatientInfo(mr_no: number, patient_name: string, dob: string){
    const params = new HttpParams()
    .set('patient_name',patient_name)
    .set('dob',dob)
    .set('page_no',1)
    .set('mr_no', mr_no);

    this.paymentService.getPatientInfo(params).subscribe((data: GetPatientListResponse) => {
      this.getPatientListResponse = {...data};
      if (this.getPatientListResponse.response_code == RESPONSE_SUCCESS) {
        console.log(this.getPatientListResponse)
        this.component.patientInfo.contact_no = this.getPatientListResponse.patient_list[0].contact_no;
        this.component.patientInfo.deposit_amount = this.getPatientListResponse.patient_list[0].deposit_amount;
        this.component.patientInfo.patient_id = this.getPatientListResponse.patient_list[0].patient_id
        this.component.patientInfo.nationality_id = this.getPatientListResponse.patient_list[0].nationality_id;
      }else{
        this.alertService.showModalAlert(`Failed to get data patient: ${this.getPatientListResponse.response_desc}`,ALERT_DANGER)
      }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get data patient, please contact administration`, ALERT_DANGER)
    })
  }

  getAdmissionDetail(){
    this.component.showPatientInfoCard = true;

    if(this.component.combinedBillList.length > 0 && typeof this.component.combinedBillList !== 'undefined'){
      this.component.loadPatientInfoCard = true;
      const temp = this.component.combinedBillList[0];
      const params = new HttpParams()
        .set('admission_no', temp.admission_no)
        .set('mr_no', temp.mr_no);

      if(this.component.admissionNo){
        if(temp.mr_no!=0) {
          this.getPatientInfo(temp.mr_no, temp.patient_name, temp.dob)
        }else{
          this.component.patientInfo.contact_no = '';
          this.component.patientInfo.deposit_amount = 0;
          this.component.patientInfo.patient_id = 0;
          this.component.patientInfo.nationality_id = 1;
        }
      }

      return this.paymentService.getAdmissionDetail(params)
        .subscribe((data: GetAdmissionDetailResponse) => {
          this.getAdmissionDetailResponse = {...data};
          
          if (this.getAdmissionDetailResponse?.response_code == RESPONSE_SUCCESS) {
            this.component.patientInfo.lob_id = this.component.combinedBillList[0].lob_id
            this.component.patientInfo.admission_id = this.component.combinedBillList[0].admission_id!
            this.component.patientInfo.mr_no = this.getAdmissionDetailResponse.mr_no
            this.component.patientInfo.discharge_date = this.getAdmissionDetailResponse.discharge_date
            this.component.patientInfo.primary_doctor_user_id = this.getAdmissionDetailResponse.primary_doctor_user_id
            this.component.patientInfo =  PropertyCopier.clone<GetAdmissionDetailResponse, Patient>(this.getAdmissionDetailResponse, this.component.patientInfo);
            
            if (this.component.patientInfo.patient_type_id == 2) this.component.patientTypePayer = true
            else this.component.patientTypePayer = false
            
            this.getDepositBalance();
          }
          else{
            this.alertService.showModalAlert(`Failed to get admisssion detail: ${this.getAdmissionDetailResponse.response_desc}`,ALERT_DANGER)
          }
          this.component.progress = false;
          this.component.loadPatientInfoCard = false;
        }, err => {
          this.alertService.showModalAlert(`An error has occured while get admisiion detail, please contact administration`, ALERT_DANGER)
          this.component.progress = false;
          this.component.loadPatientInfoCard = false;
        });
    } else {
      this.component.patientInfo = Patient.defaultWithoutMrNo()
      return false;
    }
  }

  getDepositBalance() {
    const params = new HttpParams()
      .set("page_no", 1)
      .set("mr_no", this.component.patientInfo.mr_no!)
      .set("patient_name", this.component.patientInfo.patient_name as string)
      .set("dob", this.component.patientInfo.dob as string)
      .set("patient_id", this.component.patientInfo.patient_id as number);
    this.paymentService.getPatientInfo(params).subscribe((data: GetPatientListResponse) => {
      this.getPatientListResponse = {...data};
      if (this.getPatientListResponse.response_code == RESPONSE_SUCCESS) {
        let patient = this.getPatientListResponse.patient_list[0];
        this.component.patientInfo.deposit_amount = patient.deposit_amount;
      }else{
        this.alertService.showModalAlert(`Failed to get deposit balance: ${this.getPatientListResponse.response_desc}`,ALERT_DANGER)
      }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get deposit balance, please contact administration`, ALERT_DANGER)
    })
  }

  getBilling(){
    this.component.showOrderedItemCard = true;
    this.component.loadOrderedItemCard = true;

    this.component.showInvoiceCard = true;
    this.component.loadInvoiceCard = true;

    let requestBody: GetBillingRequest = {
      admission_list: []
    };
    this.component.combinedBillList.map((c: any) => {
      let admission: any = {};
      admission.admission_no = c.admission_no;
      // admission.mr_no = c.mr_no;
      requestBody.admission_list.push(admission);
    })
    this.paymentService.getBilling(requestBody).subscribe((data: GetBillingResponse) => {
      this.getBillingResponse = {...data};
      if (this.getBillingResponse.response_code == RESPONSE_SUCCESS) {
        this.processGetBilling(this.getBillingResponse);
      }else{
        this.alertService.showModalAlert(`Failed to get billing: ${this.getBillingResponse.response_desc}`,ALERT_DANGER)
      }
      this.component.loadOrderedItemCard = false;
      this.component.loadInvoiceCard = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get billing, please contact administration`, ALERT_DANGER)
      this.component.loadOrderedItemCard = false;
      this.component.loadInvoiceCard = false;
    });
  }

  processGetBilling(data: GetBillingResponse) {
    this.component.orderedItem = []
    
    data.sales_item_type_list.forEach((i: OrderedItemType) => {
      if (i.sales_item_list != null && i.sales_item_list.length > 0) {
        if(i.is_item_issue === '0'){
          i.sales_item_list.forEach((j: any) => {
            j.checked = false;
          });
        }
        let order = this.component.orderedItem.find(o => o.sales_item_type_id == i.sales_item_type_id);
        if (order == null) {
          this.component.orderedItem.push(i);
        } else {
          i.sales_item_list.forEach((s: any) => {
            let sale = order?.sales_item_list.filter(s => s.sales_item_id == s.sales_item_id);
            if (sale == null) {
              order?.sales_item_list.push(s);
            }
          });
        }
        
      }
    });
    this.component.saveInvoiceOrderedItem = data.ordered_item_list
    this.component.invoice = PropertyCopier.clone(data, this.component.invoice);
  }

  savePayment(body: SavePaymentRequest) {
    this.component.savePaymentProgress = true;
    this.paymentService.savePayment(body)
    .subscribe((data: SavePaymentResponse) => {
      this.savePaymentResponse = {...data};
      if (this.savePaymentResponse.response_code == RESPONSE_SUCCESS) {
        this.component.showPaymentSettlementCard = true;
        this.component.payment.settle_amount = this.savePaymentResponse.settled_amount;
        this.component.payment.balance = this.savePaymentResponse.balance;
        this.component.settlement_no = this.savePaymentResponse.settlement_no;
        this.component.invoice.payer_balance = this.savePaymentResponse.payer_balance
        this.component.invoice.patient_balance = this.savePaymentResponse.balance;
        this.component.invoice.total_balance = this.savePaymentResponse.total_balance;
        this.component.cancelAddPaymentMode();
        this.component.getPaymentSettle();

        this.getDepositBalance();

        this.component.readOnlyAmount = true;
        this.component.readOnlyPaymentMode = true;

        this.alertService.showModalAlertSuccess(`Successfully save payment with settlement no: ${this.component.settlement_no}`)
      } else {
        this.alertService.showModalAlert(`Failed to save payment: ${this.savePaymentResponse.response_desc}`,ALERT_DANGER)
      }
      this.component.savePaymentProgress = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while save payment, please contact administration`, ALERT_DANGER)
      this.component.savePaymentProgress = false;
    });
  }

  getBankId(edcId: number) {
    const params = new HttpParams().set("edc_id", edcId);
    this.generalService.getEdcDetail(params)
    .subscribe((data: GetEdcDetailResponse) => {
      this.getEdcDetailResponse = {...data};
      if (this.getEdcDetailResponse.response_code == RESPONSE_SUCCESS) {
        this.component.card.bank_id = this.getEdcDetailResponse.bank_id;
      }else{
        this.alertService.showModalAlert(`Failed to get bank id: ${this.getEdcDetailResponse.response_desc}`,ALERT_DANGER)
      }
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get bank id, please contact administration`, ALERT_DANGER)
    })
  }
}