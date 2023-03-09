import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { GeneralService } from 'src/app/service/general.service';
import { InvoiceInquiryService } from 'src/app/service/invoice-inquiry.service';
import { InvoiceService } from 'src/app/service/invoice.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { PaymentListService } from 'src/app/service/payment-list.service';
import { PaymentService } from 'src/app/service/payment.service';
import { AuthService } from 'src/app/_auth/auth.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, ALERT_SUCCESS, ALERT_WARNING, PACKAGE_SALES_ITEM_TYPE, RESPONSE_SUCCESS, SERVICE_SALES_ITEM_TYPE } from 'src/app/_configs/app-config';
import { ModalDefaultConfig } from 'src/app/_configs/modal-config';
import { CancelRejectReason } from '../../models/CancelRejectReason';
import { OrderedItem } from '../../models/OrderedItem';
import { OrderedItemType } from '../../models/OrderedItemType';
import { Payment_Settlement } from '../../models/Payment_Settlement';
import { CancelReasonReq } from '../../models/request/CancelReasonReq';
import { CancelArItemPackageRequest } from '../../models/request/CancelArItemPackageReq';
import { RemoveArItemTransactionRequest } from '../../models/request/RemoveArItemTransactionReq';
import { GetListResponse } from '../../models/response/GetListResponse';
import { RemoveArItemTransactionResponse } from '../../models/response/RemoveArItemTransactionResponse';
import { ModalAlertConfirmComponent } from '../modal-alert-confirm/modal-alert-confirm.component';
import { ValidationFormsService } from '../modal-search-patient/validation-forms.service';
import { CancelArItemPackageResponse } from '../../models/response/CancelArItemPackageResponse';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-modal-cancel',
  templateUrl: './modal-cancel.component.html',
  styleUrls: ['./modal-cancel.component.scss']
})
export class ModalCancelComponent implements OnInit {

  formErrors: any;
  cancelForm!: FormGroup
  submitted: boolean = false

  constructor(public bsModalRef: BsModalRef, private generalService: GeneralService,
    private invoiceService: InvoiceService,
    private token: TokenStorageService,
    private paymentListService: PaymentListService,
    private paymentService: PaymentService,
    private invoiceInquiry: InvoiceInquiryService,
    private fb: FormBuilder,
    public vf: ValidationFormsService,
    private bsModalService : BsModalService,
    private alertService: ModalAlertService,
    private authService: AuthService) {
      this.formErrors = this.vf.errorMessages;
      this.createForm();
     }

  @Input() statusPage: string = "";
  @Input() statusNumber: string = ""
  @Input() orderedItem: OrderedItemType[] = []

  @Output() removeSalesItemChange = new EventEmitter<any>()

  getReason: boolean = false
  getListResponse!: GetListResponse
  listCancelReason: CancelRejectReason[] = []
  selectedCancelReason: CancelRejectReason = {key: '', value: ''}
  notes: string = ""
  userId: string = ""
  password: string = ""
  needPassword: boolean = false

  payload: CancelReasonReq = {
    org_id: 0,
    cancel_reason_id: 0,
    cancel_notes: "",
    is_direct_approve: "N",
    approved_by: "",
  }

  getCancelResponse: any = {}
  confirm: boolean = false
  getPaymentSettlementResponse: any
  
  removeArItemTransactionResponse!: RemoveArItemTransactionResponse
  cancelArItemPackageResponse!: CancelArItemPackageResponse

  dataCekPayment: Payment_Settlement[] = [];
  progress: boolean = false
  userDataList: any[] = []
  approverRoleId: any[] = []

  bsModalShowAlert?: BsModalRef
  bsModalShowAlertConfirm?: BsModalRef

  hopeUserId: number = 0
  userRoleId: number = 0
  userLoggedIn: string = ''

  ngOnInit(): void {
    const userData = this.token.getUserData();
    this.hopeUserId = userData.hope_user_id
    this.payload.org_id = userData.hope_organization_id;
    this.userRoleId = userData.role_id
    this.userLoggedIn = userData.user_name

    if(this.statusPage=="invoice"){
      this.payload.invoice_no = this.statusNumber
    }else{
      this.payload.settlement_no = this.statusNumber
    }

    this.getReason = true
    this.getList()
  }

  showModalConfirm(message: string){
    const initialState: ModalOptions = {
      initialState: {
        message: message,
      },
    };
    this.bsModalShowAlertConfirm = this.bsModalService.show(ModalAlertConfirmComponent, Object.assign(ModalDefaultConfig, initialState))
    return this.bsModalShowAlertConfirm.content.isConfirm
  }

  createForm() {
    this.cancelForm = this.fb.group({
      userId: [''],
      password: ['', Validators.required ],
    });
  }

  get f() {
    return this.cancelForm.controls;
  }

  getList(){
    const params = new HttpParams()
    .set('param_list', 'cancelInvoiceRequestReasonList')
    .append('param_list', 'cancelPaymentRequestReasonList')
    .append("param_list", "salesCancelReasonList")

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          if(this.statusPage=="invoice"){
            this.listCancelReason = this.getListResponse.cancelInvoiceRequestReasonList;
          } else if(this.statusPage == "sales") {
            this.listCancelReason = this.getListResponse.cancelSalesOrderRequestReasonList
          } else{
            this.listCancelReason = this.getListResponse.cancelPaymentRequestReasonList;
          }
          this.getReason = false
        }else{
          this.getReason = false
          this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
        this.getReason = false
      });
  }

  onChangeCancelReason(selected: any){
    this.selectedCancelReason = selected;
    this.payload.cancel_reason_id = selected.key;
  }

  onChangeNotes(e: any){
    this.notes = e
    this.payload.cancel_notes = this.notes
  }

  onChangeUserId(e: any){
    this.userId = e
    this.payload.approved_by = this.userId
  }

  onChangePassword(e: any){
    this.password = e
  }

  submitCancelInvoice(){
    return this.invoiceService.cancelInvoice(this.payload)
      .subscribe((data)=>{
        this.getCancelResponse = {...data}
        if(this.getCancelResponse.response_code === RESPONSE_SUCCESS){
          this.alertService.showModalAlert(this.payload.is_direct_approve == 'Y' ? 'Invoice is successfully cancelled' : 'Invoice cancellation has been requested', ALERT_SUCCESS)
          this.payload = { 
            org_id: 0,
            cancel_reason_id: 0,
            cancel_notes: "",
            is_direct_approve: "N",
            approved_by: "",
            approver_role_id: ""}
          this.bsModalRef.hide()
        }else{
          this.alertService.showModalAlert(`Failed to cancel invoice: ${this.getCancelResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while cancel invoice, please contact administration`, ALERT_DANGER)
        this.progress = false
      })
  }

  submitCancelPayment(){
    return this.paymentListService.cancelPayment(this.payload)
      .subscribe((data)=>{
        this.getCancelResponse = {...data}
        if(this.getCancelResponse.response_code === RESPONSE_SUCCESS){
          this.alertService.showModalAlert(this.payload.is_direct_approve  == 'Y' ? 'Payment has been cancelled' : 'Payment cancellation has been requested',ALERT_SUCCESS)
          this.payload = { 
            org_id: 0,
            cancel_reason_id: 0,
            cancel_notes: "",
            is_direct_approve: "N",
            approved_by: "",
            approver_role_id: ""}
          this.bsModalRef.hide()
        }else{
          this.alertService.showModalAlert(`Failed to cancel payment: ${this.getCancelResponse.response_desc}`,ALERT_DANGER)
        }
        this.progress = false
      }, err => {
        this.alertService.showModalAlert(`An error has occured while cancel payment, please contact administration`, ALERT_DANGER)
        this.progress = false
      })
  }
  
  onValidate(){
    if(this.userId!=''){
      this.payload.is_direct_approve = 'Y'
      this.submitted = true;
  
      // stop here if form is invalid
      if(this.cancelForm.status === 'VALID'){
        this.cekDataApprover()
      }else{
        this.payload.is_direct_approve = 'N'
      }
    }else{
      this.sendReason()
    }
  }

  cekDataApprover(){
    if(this.userId==this.userLoggedIn){
      this.alertService.showModalAlert('Please use another account',ALERT_DANGER)
      this.payload.is_direct_approve = 'N'
      this.payload.approved_by = ''
      this.payload.approver_role_id = ''
    }else{
      this.progress = true
      this.authService.login(this.userId, this.password).subscribe(
        data => {
          if (data.response_code == RESPONSE_SUCCESS) {
            this.userDataList = data.user_data_list
            this.userDataList = this.userDataList.filter((x: { hope_organization_id: any; }) => x.hope_organization_id == this.payload.org_id)
            this.setApproverRoleId(this.userDataList)
          }else{
            this.alertService.showModalAlert("Authentication for approver is failed",ALERT_WARNING)
            this.progress = false
          }
        },err => {
          this.alertService.showModalAlert("Authentication for approver is failed, please contact administration",ALERT_DANGER)
          this.progress = false
        }
      );
    }
  }

  setApproverRoleId(data: any){
    
    this.payload.approver_user_id = data[0].hope_user_id
    this.payload.approver_role_id = data[0].role_id
    // data.map((user)=> {
    //   this.approverRoleId.push(user.role_id)
    //   this.payload.approver_role_id = this.approverRoleId.join()
    // })
    this.sendReason()
  }

  cekPaymentSettlement(){
    const params = new HttpParams()
    .set('transaction_type', 'Payment')
    .set('transaction_no', this.statusNumber)
    .set('page_no', 1)
      
    return this.invoiceInquiry.getPaymentSettlement(params)
    .subscribe((data)=>{
      this.getPaymentSettlementResponse = {...data}
      if(this.getPaymentSettlementResponse.response_code===RESPONSE_SUCCESS){
        this.dataCekPayment = data.payment_settlement_list
        if(this.dataCekPayment.length>0){
          this.showModalConfirm('There is payment settlement linked to this invoice. By cancelling the invoice, the payment(s) are going to be cancelled. Do you want to proceed?').subscribe((item: any)=>{
            this.submitCancelInvoice();
          })
        }else{
          this.submitCancelInvoice();
        }
      }else{
        this.alertService.showModalAlert(`Failed to check payment settlement: ${this.getPaymentSettlementResponse.response_desc}`,ALERT_DANGER)
        this.progress = false
      }
    },err => {
      this.alertService.showModalAlert(`An error has occured while check payment settlement, please contact administration`, ALERT_DANGER)
      this.progress = false
    })
  }

  isServiceSalesItemType(salesItemTypeId: number): boolean {
    return SERVICE_SALES_ITEM_TYPE.includes(salesItemTypeId)
  }

  isPackageSalesItemType(salesItemTypeId: number): boolean {
    return PACKAGE_SALES_ITEM_TYPE.includes(salesItemTypeId)
  }


  async removeOrderedItem() {
    for (let i = 0; i < this.orderedItem.length; i++) {
      let d: OrderedItemType = this.orderedItem[i]

      for (let j = 0; j < d.sales_item_list.length; j++) {
        let o: OrderedItem = d.sales_item_list[j]

        if (o.checked == false) continue;

        if (this.isServiceSalesItemType(d.sales_item_type_id)) {
          let req: RemoveArItemTransactionRequest = {
            organization_id: this.payload.org_id,
            admission_id: o.admission_id,
            cancel_user_id: this.hopeUserId,
            cancel_notes: this.notes,
            cancel_reason_id: Number(this.selectedCancelReason.key),
            sales_order_id: o.sales_order_id,
            ar_item_id: o.ar_item_id,
            sales_item_name: o.sales_item_name
          }
          await this.removeArItemTransaction(req)
        } else if (this.isPackageSalesItemType(d.sales_item_type_id)) {
          let req: CancelArItemPackageRequest = {
            organization_id: this.payload.org_id,
            admission_id: o.admission_id,
            cancel_user_id: this.hopeUserId,
            cancel_notes: this.notes,
            cancel_reason_id: Number(this.selectedCancelReason.key),
            sales_order_id: o.sales_order_id,
            ar_item_id: o.ar_item_id,
            sales_item_name: o.sales_item_name
          }
          await this.removeArItemPackage(req)
        }
      }
    }
    this.progress = false
    this.removeSalesItemChange.emit(this.orderedItem);
    this.bsModalRef.hide()
  }

  async removeArItemTransaction(req: RemoveArItemTransactionRequest) {
    await firstValueFrom(this.paymentService.removeArItemTransaction(req))
    .then((data: RemoveArItemTransactionResponse) => {
      this.removeArItemTransactionResponse = {...data}
      if (this.removeArItemTransactionResponse.response_code == RESPONSE_SUCCESS) {
        this.alertService.showModalAlertSuccess(`Successfully remove item ${req.sales_item_name}`)
      } else {
        this.alertService.showModalAlertError(`Failed to remove item ${req.sales_item_name} with error: ${this.removeArItemTransactionResponse.response_desc}`)
      }
    }, err => {
      this.alertService.showModalAlertError(`Failed to remove item ${req.sales_item_name} with error: ${this.removeArItemTransactionResponse.response_desc}`)
    })
  }

  async removeArItemPackage(req: CancelArItemPackageRequest) {
    await firstValueFrom(this.paymentService.cancelArItemPackage(req))
    .then((data: CancelArItemPackageResponse) => {
      this.cancelArItemPackageResponse = {...data}
      if (this.cancelArItemPackageResponse.response_code == RESPONSE_SUCCESS) {
        this.alertService.showModalAlertSuccess(`Successfully remove item ${req.sales_item_name}`)
      } else {
        this.alertService.showModalAlertError(`Failed to remove item ${req.sales_item_name} with error: ${this.cancelArItemPackageResponse.response_desc}`)
      }
    }, err => {
      this.alertService.showModalAlertError(`Failed to remove item ${req.sales_item_name} with error: ${this.cancelArItemPackageResponse.response_desc}`)
    })
  }
  
  sendReason(){
    if(this.statusPage=="invoice"){
      this.progress = true
      this.cekPaymentSettlement()
    } else if (this.statusPage == "sales") {
      
      this.showModalConfirm('Are you sure to remove selected sales item?').subscribe((item: any) => {
        this.progress = true
        this.removeOrderedItem()
      })
    } else{
      this.showModalConfirm('Are you sure to cancel this payment?').subscribe((item: any)=>{
        this.submitCancelPayment();
      })
    }

  }

}
