import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { GeneralService } from 'src/app/service/general.service';
import { PaymentService } from 'src/app/service/payment.service';
import { GetAddRemoveSalesItemResponse } from '../../models/response/GetAddRemoveSalesItemResponse';
import { ALERT_DANGER, ALERT_SUCCESS, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { GetStoreListResponse } from '../../models/response/GetStoreListResponse';
import { HttpParams } from '@angular/common/http';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ReturnItemValidationFormsService } from './validation-forms.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ReturnArItemIssueRequest } from '../../models/request/ReturnArItemIssueRequest';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { OrderedItem } from '../../models/OrderedItem';
import { ReturnedArItemResponse } from '../../models/response/ReturnedArItemResponse';
import { Uom } from '../../models/Uom';

@Component({
  selector: 'app-modal-return-sales-item',
  templateUrl: './modal-return-sales-item.component.html',
  styleUrls: ['./modal-return-sales-item.component.scss']
})
export class ModalReturnSalesItemComponent implements OnInit {
  
  loadPage: boolean = false;
  progress: boolean = false
  
  private _itemToReturn: OrderedItem = OrderedItem.default()
  @Input() set itemToReturn(itemToReturn: OrderedItem) {
    this._itemToReturn = itemToReturn
    this.pricePerItem = itemToReturn.price
  }

  get itemToReturn() {
    return this._itemToReturn
  }

  @Output() itemReturned = new EventEmitter<any>()

  salesItemType?: string
  store: string = '';
  pricePerItem: number = 0
  notes: string = ''

  form!: FormGroup;
  submitted: boolean = false;
  formErrors: any;

  bsModalShowAlert?: BsModalRef

  getStoreListResponse: any = {}
  getAddRemoveSalesItemResponse: GetAddRemoveSalesItemResponse = {}
  returnArItemIssueResponse!: ReturnedArItemResponse

  orgId: number = 0

  constructor(public bsModalRef: BsModalRef, private generalService: GeneralService, 
    private paymentService: PaymentService, private fb: FormBuilder,
    private vf: ReturnItemValidationFormsService,
    private alertService: ModalAlertService,
    private token: TokenStorageService) {
      this.formErrors = this.vf.errorMessages;
    }

  ngOnInit(): void {
    this.createForm();
    this.getStore()

    const userData = this.token.getUserData();
    this.orgId = userData.hope_organization_id
  }

  get f() {
    return this.form.controls;
  }

  createForm() {
    this.form = this.fb.group({
      qty: ['', [Validators.required, Validators.pattern(this.vf.formRules.numberOnly), 
        Validators.min(this.vf.formRules.quantityMin)]],
      uom: ['', [Validators.required]],
      notes: ['', []]
    })
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

  getErrorMessage(formName: string, error: any): string {
    return this.formErrors[formName][error];
  }

  reset() {
    this.submitted = false;
    this.form.reset();
  }

  onChangeQty(qty: number) {
    this.itemToReturn!.qty = Number(qty);
  }

  onChangeUom(uom: any) {
    this.itemToReturn.uom_id = uom.uom_id
    this.itemToReturn!.uom = uom.uom_name;
    if (uom.uom_ratio != undefined) {
      this.pricePerItem = this.itemToReturn.price * uom.uom_ratio
    } else {
      this.pricePerItem = this.itemToReturn.price
    }
  }

  onChangeNotes(notes: string) {
    this.notes = notes
  }

  getStore() {
    this.loadPage = true;

    let params = new HttpParams().set("store_id", `${this.itemToReturn?.store_id}`);
    return this.generalService.getStoreList(params)
      .subscribe((data: GetStoreListResponse)=>
      {
        this.getStoreListResponse = {...data}
        if(this.getStoreListResponse.response_code === RESPONSE_SUCCESS){
          var result = this.getStoreListResponse.store_list.find((x : any) => x.store_id == this.itemToReturn?.store_id)
          this.store = `${result.store_name}`;
        }else{
          this.alertService.showModalAlert(`Failed to get store list: ${this.getStoreListResponse.response_desc}`,ALERT_DANGER)
        }
        this.loadPage = false;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get store list, please contact administration`, ALERT_DANGER)
        this.loadPage = false;
      });
  }

  onValidateSave() {
    this.submitted = true;
    if (this.form.valid) {
      this.alertService.showModalConfirm("Are you sure want to return this item?").content.isConfirm
      .subscribe((isConfirm: boolean) => {
        this.onSave()
      })
    }
  }

  onSave(){
    this.progress = true
    let req: ReturnArItemIssueRequest = {
      organization_id: this.orgId,
      sales_order_id: this.itemToReturn.sales_order_id,
      store_id: this.itemToReturn.store_id,
      notes: this.notes,
      returned_ar_items: [
        {
          ar_item_id: this.itemToReturn.ar_item_id,
          uom_id: this.itemToReturn.uom_id,
          quantity: this.itemToReturn.qty
        }
      ]
    }
    this.paymentService.returnArItemIssue(req)
    .subscribe((data: ReturnedArItemResponse) => {
      this.returnArItemIssueResponse = {...data}
      if (this.returnArItemIssueResponse.response_code == RESPONSE_SUCCESS) {
        this.alertService.showModalAlertSuccess(`Successfully returning item ${this.itemToReturn.sales_item_name}`)
        this.itemReturned.emit(this.itemToReturn)
        this.bsModalRef.hide()
      } else {
        this.alertService.showModalAlertError(`Failed to returning item: ${this.returnArItemIssueResponse.response_desc}`)
      }
      
      this.progress = false
    }, err => {
      this.progress = false
      this.alertService.showModalAlertError(`An error has occured while returning item, please contact administration`)
    })
  }
}
