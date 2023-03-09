import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { PaymentService } from 'src/app/service/payment.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { ModalDefaultConfig, ModalLargeConfig } from 'src/app/_configs/modal-config';
import { ModalAddCustomAdditionalDiscountComponent } from '../../general-modal/modal-add-custom-additional-discount/modal-add-custom-additional-discount.component';
import { ModalAlertConfirmComponent } from '../../general-modal/modal-alert-confirm/modal-alert-confirm.component';
import { AdditionalDiscount, CustomAdditionalDiscount } from '../../models/Additional_Discount';
import { CombinedBill } from '../../models/CombinedBill';
import { DiscountType } from '../../models/DiscountType';
import { PredefinedDiscount } from '../../models/PredefinedDiscount';
import { SaveSalesDiscount } from '../../models/request/SaveSalesDiscountReq';
import { GetListResponse } from '../../models/response/GetListResponse';
import { GetSalesDiscountByAdmissionNoResponse } from '../../models/response/GetSalesDiscountByAdmissionNoResponse';
import { SaveSalesDiscountResponse } from '../../models/response/SaveSalesDiscountResponse';
import { SalesDiscountValidationFormsService } from './validation-forms.service';
import { OrderedItemType } from '../../models/OrderedItemType';

@Component({
  selector: 'app-card-input-sales-discount',
  templateUrl: './card-input-sales-discount.component.html',
  styleUrls: ['./card-input-sales-discount.component.scss']
})
export class CardInputSalesDiscountComponent implements OnInit {

  @Input() show: boolean = false;
  loadPage: boolean = false;
  
  private _admissionList: CombinedBill[] = []
  @Input() set admissionList(value: CombinedBill[]) {
    this._admissionList = value

    let admission: CombinedBill | undefined = value.find(a => a.admission_no == this.selectedAdmission.admission_no)

    if (admission == undefined) {
      this.customAdditionalDiscountFormControls["admissionNo"].setValue('')
      this.customAdditionalDiscountFormControls["admissionNo"].updateValueAndValidity()

      this.customAdditionalDiscountFormControls["discountType"].setValue('')
      this.customAdditionalDiscountFormControls["discountType"].updateValueAndValidity()

      this.salesDiscountFormControls["predefinedDiscount"].setValue('')
      this.salesDiscountFormControls["predefinedDiscount"].updateValueAndValidity()
    }
  }
  
  get admissionList() {
    return this._admissionList
  }

  @Input() orderedItem: OrderedItemType[] = [];
  
  @Output() discountSaved = new EventEmitter<any>()  

  getListResponse!: GetListResponse;
  
  listDiscountType: Array<DiscountType> = [];
  listPredefinedDiscount: Array<PredefinedDiscount> = [];
  
  selectedAdmission: CombinedBill = CombinedBill.default()
  selectedDiscountType: DiscountType = DiscountType.default();
  selectedPredefinedDiscount: PredefinedDiscount = PredefinedDiscount.default();
  customAdditionalDiscountList: AdditionalDiscount[] = [];

  public bsModalRef?: BsModalRef;
  bsModalShowAlert?: BsModalRef
  bsModalShowAlertConfirm?: BsModalRef

  salesDiscountForm!: FormGroup;
  submitted = false;
  searched = false;
  addCustomAdditionalDiscount = false;
  progress: boolean = false;
  formErrors: any;
  isSaved: boolean = false;
  saveSalesDiscsountResponse: SaveSalesDiscountResponse | undefined;

  searchSalesDiscountProgress: boolean = false;

  getSalesDiscountByAdmissionNoResponse: GetSalesDiscountByAdmissionNoResponse | undefined;
  
  constructor(
    private generalService: GeneralService, public bsModalService: BsModalService,
    private paymentService: PaymentService, private fb: FormBuilder,
    private vf: SalesDiscountValidationFormsService,
    private alertService: ModalAlertService) {
      this.formErrors = this.vf.errorMessages;
      this.createForm();
    }

  ngOnInit(): void {
    this.getData();
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
    this.salesDiscountForm = this.fb.group({
      customAdditionalDiscountGroup: this.fb.group({
        admissionNo: ['', [Validators.required]],
        discountType: ['', [Validators.required]],
      }),
      predefinedDiscount: [{value: '', disabled: true}, [Validators.required]]
    });
    this.salesDiscountFormControls["predefinedDiscount"].disable();
  }

  get salesDiscountFormControls() {
    return this.salesDiscountForm.controls;
  }

  get customAdditionalDiscountFormControls() {
    return ((this.salesDiscountForm.get("customAdditionalDiscountGroup") as FormGroup).controls);
  }

  disableForm(form: FormGroup) {
    for (let name in form.controls) {
      let input = form.controls[name];
      if (input instanceof FormGroup) this.disableForm(input);
      else {
        if (input.enabled) input.disable();
      }
    }
  }

  reset() {
    this.submitted = false;
    this.addCustomAdditionalDiscount = false;
    this.salesDiscountForm.reset({admissionNo: ""});
  }

  isSalesDiscountFormValid(formName: string): any {
    return {
      'is-invalid': this.submitted && this.salesDiscountFormControls[formName].errors,
      'is-valid': this.submitted && !this.salesDiscountFormControls[formName].errors 
    }
  }

  isCustomAdditionalDiscountFormValid(formName: string): any {
    return {
      'is-invalid': (this.submitted || this.addCustomAdditionalDiscount) && 
                      this.customAdditionalDiscountFormControls[formName].errors,
      'is-valid': this.submitted && !this.customAdditionalDiscountFormControls[formName].errors 
    }
  }

  isSalesDiscountFormError(formName: string): false | ValidationErrors | null {
    return this.submitted && this.salesDiscountFormControls[formName].errors;
  }

  isCustomAdditionalDiscountFormError(formName: string): false | ValidationErrors | null {
    return (this.submitted || this.addCustomAdditionalDiscount) && 
            this.customAdditionalDiscountFormControls[formName].errors;
  }

  getSalesDiscountFormErrors(formName: string): ValidationErrors | null {
    return this.salesDiscountFormControls[formName].errors;
  }

  getCustomAdditionalDiscountFormErrors(formName: string): ValidationErrors | null {
    return this.customAdditionalDiscountFormControls[formName].errors;
  }

  getErrorMessage(formName: string, error: any): string {
    return this.formErrors[formName][error];
  }

  onValidateAddCustomAdditionalDiscount(): void {
    this.addCustomAdditionalDiscount = true;
    if (this.salesDiscountForm.valid) this.showModalAdd();
  }

  onValidateSaveSalesDiscount(): void {
    this.submitted = true;
    if (this.salesDiscountForm.valid) {
      this.showModalConfirm('Are you sure to save this discount setting?').subscribe((item: any)=>{
        this.saveSalesDiscount();
      })
    }
  }

  onChangeAdmissionNo(selected: CombinedBill): void {
    if (selected == undefined) selected = CombinedBill.default()
    this.selectedAdmission = selected
    if (this.selectedAdmission.admission_no != "") this.getSalesDiscountByAdmissionNo();
  }

  onChangeDiscountType(selected: DiscountType){
    this.selectedDiscountType = selected;
    switch (this.selectedDiscountType.key) {
      case '1':
        this.predefinedDiscount(this.selectedDiscountType.key);
        break;
      case '2':
        this.predefinedDiscount(this.selectedDiscountType.key);
        break;
      case '3':
        this.predefinedDiscount(this.selectedDiscountType.key);
        break;
      default:
        this.predefinedDiscount(this.selectedDiscountType.key);
    }
    this.getSalesDiscountByAdmissionNo(true);
  }

  onChangePredefinedDiscount(selected: PredefinedDiscount) {
    this.selectedPredefinedDiscount = selected;
  }

  predefinedDiscount(discountTypeId: string) {
    if (discountTypeId == '2') {
      this.salesDiscountFormControls["predefinedDiscount"].enable();
      this.salesDiscountFormControls["predefinedDiscount"].reset();
      this.salesDiscountFormControls["predefinedDiscount"].updateValueAndValidity();
    } else {
      this.salesDiscountFormControls["predefinedDiscount"].disable();
      this.salesDiscountFormControls["predefinedDiscount"].setValue("");
      this.salesDiscountFormControls["predefinedDiscount"].reset();
      this.salesDiscountFormControls["predefinedDiscount"].updateValueAndValidity();
    }
  }

  getData(): void { 
    this.loadPage = true;

    const params = new HttpParams()
      .set('param_list', 'salesDiscountTypeList')
      .append('param_list', 'predefinedDiscountList');
  
    this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse)=>
      {
        this.getListResponse = {...data};
        if (this.getListResponse.response_code === RESPONSE_SUCCESS) {
          this.listDiscountType = this.getListResponse.salesDiscountTypeList;
          this.listPredefinedDiscount = this.getListResponse.predefinedDiscountList;
        } else {
          this.alertService.showModalAlert(`Failed to get list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
        }
        this.loadPage = false;
      }, err => {
        this.loadPage = false;
        this.alertService.showModalAlert(`An error has occured while get list, please contact administration`, ALERT_DANGER)
      });
    }

  checkIfDiscountTypeAvailable(data: GetSalesDiscountByAdmissionNoResponse) {
    return data.sales_discount_type_id != null && data.sales_discount_type_id != 0
  }

  getSalesDiscountByAdmissionNo(discountTypeChange: boolean = false) {
    this.loadPage = true
    this.searchSalesDiscountProgress = true;

    let params = new HttpParams().set("admission_no", this.selectedAdmission.admission_no);
    this.paymentService.getSalesDiscountByAdmissionNo(params)
    .subscribe((data: GetSalesDiscountByAdmissionNoResponse) => {
      this.getSalesDiscountByAdmissionNoResponse = {...data};
      if (this.getSalesDiscountByAdmissionNoResponse.response_code == RESPONSE_SUCCESS) {
        if (this.checkIfDiscountTypeAvailable(this.getSalesDiscountByAdmissionNoResponse)) {
          let discountType: DiscountType = this.listDiscountType.find(d => Number(d.key) == this.getSalesDiscountByAdmissionNoResponse?.sales_discount_type_id)!;
          if (!discountTypeChange) this.customAdditionalDiscountFormControls["discountType"].setValue(discountType)

          switch (this.getSalesDiscountByAdmissionNoResponse.sales_discount_type_id) {
            case 1:
              // Default discount
              break
            case 2:
              // Predefined Additional Discount
              let predefinedId: number = this.getSalesDiscountByAdmissionNoResponse.predefined_discount_id
              let predefined: PredefinedDiscount = this.listPredefinedDiscount.find(p => Number(p.key) == predefinedId)!;
              if (!discountTypeChange || this.selectedDiscountType.key == "2") this.salesDiscountFormControls["predefinedDiscount"].setValue(predefined)
              break
            case 3:
              if (this.getSalesDiscountByAdmissionNoResponse.custom_add_discount_list != null) {
                this.customAdditionalDiscountList = this.getSalesDiscountByAdmissionNoResponse.custom_add_discount_list;
              }
              break
          }
        }
      }else{
        this.alertService.showModalAlert(`Failed to get sales discount data: ${this.getSalesDiscountByAdmissionNoResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadPage = false
      this.searchSalesDiscountProgress = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get sales discount data, please contact administration`, ALERT_DANGER)
      this.loadPage = false
      this.searchSalesDiscountProgress = false;
    })
  }

  customAdditionalDiscountChangeRadio(d: any, e: any): void {
    this.customAdditionalDiscountList[this.customAdditionalDiscountList.indexOf(d)].checked = e.target.checked;
  }

  customAdditionalDiscountSelectAll(e: any): void {
    this.customAdditionalDiscountList.forEach((i: any) => {
      i.checked = e.target.checked;
    });
  }

  removeCustomAdditionalDiscount(): void {
    for (var i = this.customAdditionalDiscountList.length - 1; i >= 0; i--) {
      if (this.customAdditionalDiscountList[i].checked) { 
          this.customAdditionalDiscountList.splice(i, 1);
      }
    }
  }

  showModalAdd(): void {
    const initialState: ModalOptions = {
      initialState: {
        orderedItem: this.orderedItem,
        customAdditionalDiscountList: this.customAdditionalDiscountList
      }
    }
    this.bsModalRef = this.bsModalService.show(ModalAddCustomAdditionalDiscountComponent, Object.assign(ModalLargeConfig, initialState))

    this.bsModalRef.content.newCustomAdditionalDiscount.subscribe((item: AdditionalDiscount[]) => {
      item.forEach(i => {
        this.customAdditionalDiscountList.push(i)
      })
      this.customAdditionalDiscountList.forEach((i: any) => {
        i.checked = false;
      });
    })
  }

  saveSalesDiscount(): void {
    this.progress = true;

    let customAdditionalDiscountList = this.createCustomAdditionalDiscountReq();
    let saveSalesDiscount = this.createSaveSalesDiscountReq(customAdditionalDiscountList);

    this.paymentService.doSaveSalesDiscount(saveSalesDiscount)
    .subscribe((data: SaveSalesDiscountResponse) => {
      this.saveSalesDiscsountResponse = {...data};
      if (this.saveSalesDiscsountResponse.response_code == RESPONSE_SUCCESS) {
        this.discountSaved.emit()
        this.alertService.showModalAlertSuccess(`Successfully save sales discount with admission no ${saveSalesDiscount.admission_no}`)
      } else {
        this.alertService.showModalAlert(`Failed to save sales discount: ${this.saveSalesDiscsountResponse.response_desc}`,ALERT_DANGER)
      }
      this.progress = false;
    }, err => {
      this.progress = false;
      this.alertService.showModalAlert(`An error has occured while save sales discount, please contact administration`, ALERT_DANGER)
    })
  }

  createCustomAdditionalDiscountReq(): CustomAdditionalDiscount[] {
    let customAdditionalDiscountList: CustomAdditionalDiscount[] = [];
    this.customAdditionalDiscountList.forEach(c => {
      let custom: CustomAdditionalDiscount = {
        disc_transaction_level_id: c.transaction_level_id,
        portion_type_id: c.portion_type_id,
        disc_type_id: c.disc_type_id,
        disc_factor: c.disc_factor,
        notes: c.notes
      }

      switch (c.transaction_level_id) {
        // Sales Item Type
        case 1:
          custom.sales_item_type_id = c.sales_item_type_id;
          custom.sales_item_type_name = c.sales_item_type_name;
          break;
        // Sales Item Group
        case 2:
          custom.sales_item_group_id = c.sales_item_group_id;
          custom.sales_item_group_name = c.sales_item_group_name;
          break;
        // Sales Item
        case 3:
          custom.sales_item_id = c.sales_item_id;
          custom.sales_item_name = c.sales_item_name;
          break;
        // Ordered Item
        case 4:
          custom.ordered_item_id = c.ordered_item_id;
          custom.ordered_item_name = c.ordered_item_name;
          break;
      }

      customAdditionalDiscountList.push(custom);
    })
    return customAdditionalDiscountList;
  }

  createSaveSalesDiscountReq(customAdditionalDiscountList: CustomAdditionalDiscount[]) {
    let saveSalesDiscount: SaveSalesDiscount = {
      admission_id: this.selectedAdmission.admission_id,
      admission_no: this.selectedAdmission.admission_no,
      sales_discount_type_id: Number(this.selectedDiscountType.key),
    }

    switch (this.selectedDiscountType.key) {
      case '2':
        saveSalesDiscount.predefined_discount_id = Number(this.selectedPredefinedDiscount.key);
        saveSalesDiscount.predefined_discount_name = this.selectedPredefinedDiscount.value;
        break;
      case '3':
        saveSalesDiscount.custom_add_discount_list = customAdditionalDiscountList;
        break;
    }
    return saveSalesDiscount;
  }
}
