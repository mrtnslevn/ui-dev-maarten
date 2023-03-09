import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { EdcService } from 'src/app/service/edc.service';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { Edc } from "../../models/div-card-payment/Edc";
import { EdcList } from '../../models/EdcList';
import { Payment } from '../../models/Payment';
import { EdcParseMessageResponse } from '../../models/response/EdcParseMessageResponse';
import { GetListResponse } from '../../models/response/GetListResponse';
import { EdcValidationFormsService } from './validation-forms.service';
import { PropertyCopier } from "src/app/_helpers/property-copier";
import { EdcParseMessageRequest } from '../../models/request/EdcParseMessageReq';
import { EdcGenerateMessageRequest } from '../../models/request/EdcGenerateMessageReq';
import { firstValueFrom } from 'rxjs';
import { EdcGenerateMessageResponse } from '../../models/response/EdcGenerateMessageResponse';

@Component({
  selector: 'app-div-edc',
  templateUrl: './div-edc.component.html',
  styleUrls: ['./div-edc.component.scss']
})
export class DivEdcComponent implements OnInit {

  public _readOnly: boolean = false;
  @Input() set readOnly(readOnly: boolean) {
    this._readOnly = readOnly;

    if (!this._readOnly) {
      this.merchantFormControls["merchantId"].enable()
      this.data = Edc.default()
      this.process = false;
      return;
    } 

    this.resetForm()
    this.disableForm()
  }

  @Input() data: Edc = Edc.default()

  @Output() dataChange = new EventEmitter<Edc>();

  @Input() payment: Payment = Payment.default()

  @Input() submitted: boolean = false;
  @Output() submittedChange = new EventEmitter<boolean>();

  @Input() paymentFormValid: boolean = false;
  @Input() formValid: boolean = false;
  @Output() formValidChange = new EventEmitter<boolean>();

  loadPage: boolean = false;
  
  form!: FormGroup;
  formErrors: any
  
  getListResponse: GetListResponse | undefined;

  generateMessageResponse!: EdcGenerateMessageResponse
  parseMessageResponse!: EdcParseMessageResponse;

  listEdc: EdcList[] = []
  selectedEdc: EdcList = EdcList.default();

  process: boolean = false;
  progress: boolean = false;
  bsModalShowAlert?: BsModalRef

  constructor(private generalService: GeneralService, private edcService: EdcService,
    private fb: FormBuilder, private vf: EdcValidationFormsService,
    private alertService: ModalAlertService) {
    this.formErrors = this.vf.errorMessages; 
    this.createForm();
  }

  ngOnInit(): void {
    this.getList();
  }

  get f() {
    return this.form.controls;
  }

  get merchantForm(): FormGroup {
    return (this.form.get("merchantForm") as FormGroup)
  }

  get merchantFormControls() {
    return this.merchantForm.controls
  }

  createForm() {
    this.form = this.fb.group({
      merchantForm: this.fb.group({
        merchantId: ['', [Validators.required]]
      }),
      cardNo: ['', [Validators.required]],
      cardHolderName: ['', []],
      bank: ['', [Validators.required]],
      approvalCode: ['', [Validators.required]],
      transactionId: ['', [Validators.required]],
      cardExpiryDate: ['', []],
      referenceNo: ['', [Validators.required]],
      notes: ['', []]
    })
  }

  resetForm() {
    this.form.reset({
      merchantId: '',
      cardNo: '',
      cardHolderName: '',
      bank: '',
      approvalCode: '',
      transactionId: '',
      cardExpiryDate: '',
      referenceNo: '',
      notes: ''
    })
  }

  resetFormWithoutMerchantId() {
    this.f["cardNo"].setValue("")
    this.f["cardHolderName"].setValue("")
    this.f["bank"].setValue("")
    this.f["approvalCode"].setValue("")
    this.f["transactionId"].setValue("")
    this.f["cardExpiryDate"].setValue("")
    this.f["referenceNo"].setValue("")
    this.f["notes"].setValue("")
  }

  enableForm() {
    this.f["cardNo"].enable()
    this.f["cardHolderName"].enable()
    this.f["bank"].enable()
    this.f["approvalCode"].enable()
    this.f["transactionId"].enable()
    this.f["cardExpiryDate"].enable()
    this.f["referenceNo"].enable()
  }

  disableForm() {
    this.f["cardNo"].disable()
    this.f["cardHolderName"].disable()
    this.f["bank"].disable()
    this.f["approvalCode"].disable()
    this.f["transactionId"].disable()
    this.f["cardExpiryDate"].disable()
    this.f["referenceNo"].disable()
  }

  isFormValid(formName: string) {
    return { 'is-invalid': this.submitted && this.f[formName].errors, 
              'is-valid': this.submitted && !this.f[formName].errors }
  }

  isFormError(formName: string) {
    return this.submitted && this.f[formName].errors;
  }

  getErrors(formName: string): any {
    return this.f[formName].errors;
  }

  isMerchantFormValid(formName: string) {
    return { 'is-invalid': this.process && this.merchantFormControls[formName].errors, 
              'is-valid': this.process && !this.merchantFormControls[formName].errors }
  }

  isMerchantFormError(formName: string) {
    return this.process && this.merchantFormControls[formName].errors;
  }

  getMerchantFormErrors(formName: string) {
    return this.merchantFormControls[formName].errors;
  }

  getErrorMessage(formName: string, error: any): string {
    return this.formErrors[formName][error];
  }

  getList(){
    this.loadPage = true;

    const params = new HttpParams()
    .set('param_list', 'edcList');

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS){
          this.listEdc = this.getListResponse.edcList
        } else {
          this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
        }
        this.loadPage = false;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
        this.loadPage = false;
      });
  }

  onChangeEdc(selected: EdcList){
    if (selected == null) selected = EdcList.default();
    this.selectedEdc = selected;
    this.data.edc_id = this.selectedEdc.edc_id;
    this.data.edc_name = this.selectedEdc.edc_name;
    this.data.bank_id = this.selectedEdc.bank_id
    this.data.is_integrated = this.selectedEdc.is_integrated

    this.submitted = false
    this.submittedChange.emit(this.submitted)
    if (this.selectedEdc.is_integrated == "N") {
      this.data.paid_status = true
      this.enableForm()
    } else {
      this.resetFormWithoutMerchantId()
      this.data.paid_status = false
      this.disableForm()
    }

    this.updateValidity();
  }

  onChangeCardNo(cardNo: string) {
    this.data.card_no = cardNo

    this.updateValidity()
  }

  onChangeCardHolderName(cardHolderName: string) {
    this.data.card_holder_name = cardHolderName

    this.updateValidity()
  }

  onChangeBank(bank: string) {
    this.data.bank = bank

    this.updateValidity()
  }

  onChangeApprovalCode(approvalCode: string) {
    this.data.approval_code = approvalCode

    this.updateValidity()
  }

  onChangeTransactionId(transactionId: string) {
    this.data.transaction_id = transactionId

    this.updateValidity()
  }

  onChangeCardExpiryDate(expiryDate: string) {
    this.data.card_expiry_date = expiryDate
    this.updateValidity()
  }

  onChangeReferenceNo(referenceNo: string) {
    this.data.reference_no = referenceNo

    this.updateValidity()
  }

  onChangeNotes(notes: string) {
    this.data.notes = notes;

    this.updateValidity()
  }

  updateValidity() {
    this.formValid = this.form.valid;
    this.formValidChange.emit(this.formValid);
    this.dataChange.emit(this.data);
  }

  onValidateProcessEdc() {
    this.process = true;
    this.submitted = true;
    this.submittedChange.emit(this.submitted);
    if (this.merchantForm.valid && this.paymentFormValid && this.submitted) this.processEdc();
  }

  async processEdc() {
    this.progress = true;
    let req: EdcGenerateMessageRequest = {
      transaction_type: "Sale",
      amount: this.payment.amount,
      card_type: this.data.card_type!,
      edc_id: this.selectedEdc.edc_id
    }
    await firstValueFrom(this.edcService.generateMessage(this.selectedEdc, req)).then((data: EdcGenerateMessageResponse) => {
      this.generateMessageResponse = {...data}
      if (this.generateMessageResponse.response_code == RESPONSE_SUCCESS) {
        this.triggerEdc()
      } else {
        this.progress = false
        this.alertService.showModalAlertError(`Error when generating message for edc with error: ${this.generateMessageResponse.response_desc}`)
      }
    }, (err: HttpErrorResponse) => {
      this.progress = false
      
      this.generateMessageResponse = err.error
      if (this.generateMessageResponse.response_desc != undefined) this.alertService.showModalAlertError(`Error when generating message for edc with error: ${this.generateMessageResponse.response_desc}`)
      else this.alertService.showModalAlertError(`Error when generating message for edc. Please contact administration`)
    })
  }

  async triggerEdc() {
    let edcResp: EdcParseMessageRequest = EdcParseMessageRequest.default()
    try {
      edcResp = await this.edcService.triggerSerial(this.selectedEdc, this.generateMessageResponse)
      await this.parseMessage(edcResp)
    } catch (err) {
      this.progress = false
      this.alertService.showModalAlertError(`${err}`)
    }
  }

  async parseMessage(req: EdcParseMessageRequest) {
    await firstValueFrom(this.edcService.parseMessage(this.selectedEdc, req)).then((data: EdcParseMessageResponse) => {
      this.parseMessageResponse = {...data}
      if (this.parseMessageResponse.response_code == RESPONSE_SUCCESS) {
        this.data.paid_status = true
        this.data = PropertyCopier.clone(this.parseMessageResponse, this.data)
        this.merchantFormControls["merchantId"].disable()
        this.f["cardNo"].setValue(this.data.card_no)
        this.f["cardHolderName"].setValue(this.data.card_holder_name)
        this.f["bank"].setValue(this.data.bank)
        this.f["approvalCode"].setValue(this.data.approval_code)
        this.f["transactionId"].setValue(this.data.transaction_id)
        this.f["cardExpiryDate"].setValue(this.data.card_expiry_date)
        this.f["referenceNo"].setValue(this.data.reference_no)
        this.disableForm()
        this.dataChange.emit(this.data);

        this.updateValidity()
      } else {
        this.enableForm()
        this.data.is_integrated = "N"
        this.data.paid_status = true
        this.updateValidity()
        this.alertService.showModalAlertError(`Failed to process edc: ${this.parseMessageResponse.response_desc}`)
      }

      this.progress = false
    }, (err: HttpErrorResponse) => {
      this.progress = false
      this.parseMessageResponse = err.error
      if (this.parseMessageResponse.response_desc != undefined) this.alertService.showModalAlertError(`Failed to process edc: ${this.parseMessageResponse.response_desc}`)
      else this.alertService.showModalAlertError(`Failed to process edc. Please contact administration`)
    })
  }
}
