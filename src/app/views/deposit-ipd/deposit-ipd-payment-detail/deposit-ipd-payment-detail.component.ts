import { FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { ValidationFormsService } from './validation-forms.service';
import { Paging } from 'src/app/general/models/Paging';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { Pagination } from 'src/app/_helpers/pagination';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { PaginationComponent } from '@coreui/angular';
import { PageChangedEvent } from 'ngx-bootstrap/pagination';
import { ActivatedRoute, Router } from '@angular/router';
import { DepositIpdService } from 'src/app/service/deposit-ipd.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { formatDate } from '@angular/common';
import { GetAdmissionDetailResponse } from 'src/app/general/models/response/GetAdmissionDetailResponse';
import { PaymentMode, PaymentModePayment } from 'src/app/general/models/PaymentMode';
import { Payment } from 'src/app/general/models/Payment';
import { DepositIpdPaymentDetailFormsService } from './deposit-ipd-payment-detail-forms.service';
import { Invoice } from 'src/app/general/models/Invoice';
import { Edc } from 'src/app/general/models/div-card-payment/Edc';
import { Cash } from 'src/app/general/models/div-card-payment/Cash';
import { Digital_Payment } from 'src/app/general/models/div-card-payment/Digital_Payment';
import { Bank_Transfer } from 'src/app/general/models/div-card-payment/Bank_Transfer';
import { Payer } from 'src/app/general/models/div-card-payment/Payer';
import { Prepaid } from 'src/app/general/models/div-card-payment/Prepaid';
import { Giro } from 'src/app/general/models/div-card-payment/Giro';
import { Patient } from 'src/app/general/models/Patient';
import { GetListResponse } from 'src/app/general/models/response/GetListResponse';
import { PaymentModeListForDeposit, PaymentModeListForDepositPayment } from 'src/app/general/models/PaymentModeListForDeposit';
import { ComboBox } from 'src/app/general/models/ComboBox';
import { DepositIpdPaymentSearchParam } from 'src/app/general/models/search-param/DepositIpdPaymentSearchParam';
import { GeneralService } from 'src/app/service/general.service';
import { GetPatientListResponse } from 'src/app/general/models/response/GetPatientListResponse';
import { SavePaymentDepositRequest } from 'src/app/general/models/request/SavePaymentReq';
import { Admission } from 'src/app/general/models/Admission';
import { SavePaymentUtils } from 'src/app/_helpers/SavePaymentUtils';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalValidasiUserComponent } from 'src/app/general/general-modal/modal-validasi-user/modal-validasi-user.component';
import { ModalLargeConfig } from 'src/app/_configs/modal-config';
import { GetAdmissionDetailDepositResponse } from 'src/app/general/models/response/GetAdmissionDetailDepositResponse';
import { Depositor } from 'src/app/general/models/Depositor';
import { SaveDepositPaymentResponse } from 'src/app/general/models/response/SaveDepositPaymentResponse';

@Component({
  selector: 'app-deposit-ipd-payment-detail',
  templateUrl: './deposit-ipd-payment-detail.component.html',
  styleUrls: ['./deposit-ipd-payment-detail.component.scss'],
})
export class DepositIpdPaymentDetailComponent implements OnInit {

  loadPage: boolean = false;
  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent

  detailPatient: Admission = Admission.default()
  showPaymentCard: boolean = false

  paging: Paging = new Paging(0, 0, 0, 0, 0)
  current_page: number = 1;
  page?: number;
  getParams: any
  param: any
  mrNo: string = ""

  public paymentModeList: PaymentModeListForDeposit[] = []
  private getListResponse!: GetListResponse;
  public getPatientListResponse : GetPatientListResponse | undefined;
  saveDepositPaymentResponse!: SaveDepositPaymentResponse
  public patient_list : any = [];

  cash: Cash = Cash.default();
  card: Edc = Edc.default();
  digitalPayment: Digital_Payment = Digital_Payment.default();
  bankTransfer: Bank_Transfer = Bank_Transfer.default();
  payer: Payer = Payer.default();
  prepaid: Prepaid = Prepaid.default();
  giro: Giro = Giro.default();
  formValid: PaymentModePayment = PaymentModePayment.default()
  

  @Input() patientId: number = 0
  @Input() admissionId: number = 0

  listPayment: ComboBox[] = []

  name: string = ""
  depositAmount: number = 0
  age: number = 0;
  address: string = ""
  email: string = ""
  contact: string = ""
  dob: string = ""
  admissionNo: string = ""

  savePaymentProgress: boolean = false


  public selectedPaymentMode: PaymentModeListForDeposit = PaymentModeListForDeposit.default()
  public invoice: Invoice = Invoice.default()
  public admission: Admission = Admission.default()
  public patientInfo: Patient = Patient.default()
  patientInfoDeposit: Patient = Patient.default()
  
  saveDepositPaymentProgress: boolean = false
  

  params: any
  public org_id: number = 0
  public readOnlyAmount: boolean = true
  public readOnlyNet : boolean = true
  public readOnlyPaymentMode: boolean = true
  public readOnlyBank : boolean = true
  public readOnlyOpeningBalance : boolean = true
  public disabledAdd: boolean = false
  public disabledSave: boolean = true
  public disabledCancel: boolean = true
  public payment: Payment = Payment.default()
  public getAdmissionDetailResponse : GetAdmissionDetailDepositResponse | undefined;

  bsModalUserValidation?: BsModalRef
  paymentMode: PaymentModeListForDepositPayment = PaymentModeListForDepositPayment.default();

  depositor: Depositor = Depositor.default()

    constructor(
      private route: ActivatedRoute,
      private router: Router,
      private token: TokenStorageService,
      private depositIpdService: DepositIpdService,
      private alertService: ModalAlertService,
      public fs: DepositIpdPaymentDetailFormsService,
      private generalService: GeneralService,
      private bsModalService: BsModalService,){
        let param: string = window.sessionStorage.getItem(DepositIpdPaymentSearchParam.PARAM_KEY)!
        this.patientInfoDeposit = JSON.parse(param)
        console.log(this.patientInfoDeposit);
        fs.createForm();
        
    }

    ngOnInit(): void {
      this.getParams = this.route.params.subscribe(param => {
        this.mrNo = param['mrNo'];
      })

      this.age = this.patientInfoDeposit.age!
      this.depositAmount = this.patientInfoDeposit.deposit_amount!

      const userData = this.token.getUserData();
      this.org_id = userData.hope_organization_id;

      this.params = new HttpParams()
      .set('mr_no', this.mrNo)
      .set('admission_type', "Inpatient")
      .set('org_id', this.org_id)
      this.getAdmissionDetail();
      // this.getDepositHistoryDetail();
      this.getList()
      // this.getPatientList()
    }

    getAdmissionDetail(){
      this.loadPage = true

      const params = new HttpParams()
      .set("page_no", 1)
      .set('admission_date_to', this.getTodaysDate())
      .set('admission_date_from', this.getYearBeforeDate())
      .set('mr_no', this.mrNo)
      .set('admission_type', "Inpatient")
  
      return this.depositIpdService.getAdmissionList(params).subscribe((data: GetAdmissionDetailDepositResponse)=>
      {
        this.getAdmissionDetailResponse = {...data};
        if(this.getAdmissionDetailResponse.response_code === RESPONSE_SUCCESS){
          this.admission = this.getAdmissionDetailResponse.admission_list[0]
          // this.admissionNo = this.detailPatient.admission_no
        }else{
          this.alertService.showModalAlert(`Failed to get invoice detail: ${data.response_desc}`,ALERT_DANGER)
        }

        this.loadPage = false
      }, err => {
        this.loadPage = false
        this.alertService.showModalAlert(`An error has occured while get invoice detail, please contact administration`, ALERT_DANGER)
      });
  
    }

    getTodaysDate() {
      return formatDate(Date.now(), "yyyy-MM-dd", "en-US")
    }
    getYearBeforeDate() {
      const minute = 1000 * 60;
      const hour = minute * 60;
      const day = hour * 24;
      const year = day * 365;
      return formatDate(Date.now()-year, "yyyy-MM-dd", "en-US")
    }
    onChangePaymentAmount(amount: number) {
      const newPayment: Payment = {...this.payment};
      newPayment.amount = amount;
      newPayment.net = amount;
      this.payment = newPayment;
      this.fs.updateClosingBalance(this.getClosingBalance(amount))
    }

    getClosingBalance(opening: number){
      let closingBalance = opening + this.depositAmount;
      if (closingBalance < 0) closingBalance = 0;
      return closingBalance;
    }

    getList() {
      // this.loadPage = true;
      const params = new HttpParams()
      .append('param_list', 'paymentModeListForDepositIpd')
  
      this.depositIpdService.getList(params)
      .subscribe((data: GetListResponse) => {
        this.getListResponse = {...data};
        if (this.getListResponse.response_code == RESPONSE_SUCCESS) {

          this.getListResponse.paymentModeListForDepositIpd.forEach((g: PaymentModeListForDeposit) => {
            this.listPayment.push(g)
  
          });
        } else {
          this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
        }
        // this.loadPage = false;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
        // this.loadPage = false;
      })
    }

    getPatientList(event?: PageChangedEvent) {
      const param = new HttpParams().set('patient_name', this.patientInfoDeposit.patient_name!)
      .set('dob', this.patientInfoDeposit.dob!)
      .set("page_no", this.patientInfoDeposit.page_no!);

      return this.generalService.getPatientList(param)
        .subscribe((data: GetPatientListResponse) => {
          this.getPatientListResponse = {...data};
          if(this.getPatientListResponse.response_code === RESPONSE_SUCCESS) {
            this.patient_list = this.getPatientListResponse.patient_list;
            this.age = this.patient_list[0].age;
            this.depositAmount = this.patient_list[0].deposit_amount;
            console.log(this.depositAmount);
          } else {
            this.alertService.showModalAlert(`Failed to get data patient: ${this.getPatientListResponse.response_desc}`,ALERT_DANGER)
          }
        }, err => {
          this.alertService.showModalAlert(`An error has occured while get data patient , please contact administration`, ALERT_DANGER)
        });
    }

    cancelAddPaymentMode(): void {
      this.readOnlyPaymentMode = true;
      this.readOnlyBank = true;
      this.readOnlyNet = true;
  
      this.disabledAdd = false;
      this.disabledCancel = true;
      this.disabledSave = true;
  
      // form.resetForm();
      this.fs.submitted = false;
      this.fs.reset();
      this.readOnlyAmount = true;
    }
  
    displayPaymentMode(paymentModeName: string) {
      let paymentMode: any = {...this.paymentMode}
      for (const prop in paymentMode) {
        if (prop == paymentModeName) {
          paymentMode[prop] = true;
        }
        else paymentMode[prop] = false;
      }
      this.paymentMode = paymentMode;
    }

    onChangePaymentMode(selection: PaymentModeListForDeposit) {
      this.fs.submitted = false;
      if (selection == null) selection = { key: '', value: '' }
  
      this.selectedPaymentMode = selection;
      
      this.readOnlyAmount = false;
      switch(selection.key){
        case "1":
          // Cash
          this.displayPaymentMode("cash");
          break;
        case "2":
          // Credit Card
          this.card.card_type = "Credit Card";
          this.displayPaymentMode("edc");
          break;
        case "3":
          // Debit Card
          this.card.card_type = "Debit Card";
          this.displayPaymentMode("edc");
          break;
        case "10":
          // Digital Payment
          this.displayPaymentMode("digitalPayment");
          break;
        case "6":
          // Bank Transfer
          this.displayPaymentMode("bankTransfer");
          break;
        case "4":
          // Cheque
          this.displayPaymentMode("giro");
          break;
        default:
          this.displayPaymentMode("");
          break;
      }
    }
  
    // pageChanged(event: PageChangedEvent) {
    //   this.params = this.params.set("page_no", event.page);
    // }

    back(){
      this.router.navigateByUrl("/deposit-ipd/deposit-ipd-payment", { state: { fromDetail: true } });
    }

    addPaymentMode(): void {
      this.readOnlyAmount = false
      this.readOnlyPaymentMode = false;
      this.disabledAdd = true;
      this.disabledCancel = false;
      this.disabledSave = false;
  
      this.fs.controls["amount"].setValue(this.payment.balance)
      this.fs.controls["email"].setValue(this.patientInfoDeposit.email);
      this.fs.controls["openingBalance"].setValue(this.patientInfoDeposit.deposit_amount)
    }

    submitAddPayment(){
      this.fs.submitted = true
      let valid: boolean = false
      let body: SavePaymentDepositRequest = {
        admission_no: this.admission.admission_no,
        admission_id: this.admission.admission_id,
        payment_mode_id: Number(this.selectedPaymentMode.key),
        payment_mode_name: this.selectedPaymentMode.value,
        amount: this.payment.amount,
        balance: this.payment.balance,
        org_id: this.org_id,
        notes: "",
        patient_info: this.patientInfoDeposit,
        depositor_data: this.depositor
      }
  
      switch (this.selectedPaymentMode.key) {
        case '1':
          SavePaymentUtils.cash(this.formValid, body, this.cash);
          valid = this.formValid.cash;
          break;
        case '2':
          // this.paymentRepository.getBankId(this.card.edc_id!);
          SavePaymentUtils.creditCard(this.formValid, body, this.card);
          valid = this.formValid.edc && this.card.paid_status;
          break;
        case '3':
          // this.paymentRepository.getBankId(this.card.edc_id!);
          SavePaymentUtils.debitCard(this.formValid, body, this.card);
          valid = this.formValid.edc && this.card.paid_status;
          break;
        case '4':
            SavePaymentUtils.chequeGiro(this.formValid, body, this.giro);
            valid = this.formValid.giro;
            break;
        case '6':
          SavePaymentUtils.bankTransfer(this.formValid, body, this.bankTransfer);
          valid = this.formValid.bankTransfer;
          break;
        case '9':
          SavePaymentUtils.additionalPayer(this.formValid, body, this.payer);
          valid = this.formValid.payer;
          break;
        case '10':
          SavePaymentUtils.digitalPayment(this.formValid, body, this.digitalPayment, 
            this.patientInfo);
          valid = this.formValid.digitalPayment && this.digitalPayment.paid_status;
          break;
        case '12':
          this.payment.amount = this.prepaid.amount;
          SavePaymentUtils.prepaid(this.formValid, body, this.prepaid);
          valid = this.formValid.prepaid;
          break;
      }
  
      if (this.fs.valid && valid) {
        this.alertService.showModalConfirm('Are you sure to save this payment?').content.isConfirm
        .subscribe((isConfirm: boolean) => {
          this.showModalUserValidation(body)
        })
      }
      
    }

    showModalUserValidation(body: SavePaymentDepositRequest) {
      this.bsModalUserValidation = this.bsModalService.show(ModalValidasiUserComponent, ModalLargeConfig)
      this.bsModalUserValidation.content.isUserValid.subscribe((data: any) => {
        this.savePayment(body);
      })
    }

    savePayment(body: SavePaymentDepositRequest) {
      this.saveDepositPaymentProgress = true
      this.depositIpdService.saveDepositPayment(body)
      .subscribe((data: SaveDepositPaymentResponse) => {
        this.saveDepositPaymentResponse = {...data};
        if (this.saveDepositPaymentResponse.response_code == RESPONSE_SUCCESS) {
          
  
          this.alertService.showModalAlertSuccess(`Successfully save Deposit Payment with settlement no: ${this.saveDepositPaymentResponse.deposit_no}`)
        } else {
          this.alertService.showModalAlert(`Failed to save payment: ${this.saveDepositPaymentResponse.response_desc}`,ALERT_DANGER)
        }
        this.saveDepositPaymentProgress = false;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while save payment, please contact administration`, ALERT_DANGER)
        this.saveDepositPaymentProgress = false;
      });
    }
  
    
}