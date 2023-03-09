import { HttpParams } from '@angular/common/http';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { GeneralService } from 'src/app/service/general.service';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { ModalLargeConfig } from 'src/app/_configs/modal-config';
import { ModalSearchSalesItemComponent } from '../modal-search-sales-item/modal-search-sales-item.component';
import { AdditionalDiscount } from '../../models/Additional_Discount';
import { DiscountType } from '../../models/DiscountType';
import { OrderedItem } from '../../models/OrderedItem';
import { PortionType } from '../../models/PortionType';
import { GetListResponse } from '../../models/response/GetListResponse';
import { ItemList } from '../../models/response/GetSalesItemListResponse';
import { SalesItem } from '../../models/SalesItem';
import { SalesItemGroup } from '../../models/SalesItemGroup';
import { SalesItemType } from '../../models/SalesItemType';
import { TransactionLevel } from '../../models/TransactionLevel';
import { CustomAdditionalDiscountValidationFormsService } from './validation-forms.service';
import { OrderedItemType } from '../../models/OrderedItemType';
import { PropertyCopier } from 'src/app/_helpers/property-copier';

@Component({
  selector: 'app-modal-add-custom-additional-discount',
  templateUrl: './modal-add-custom-additional-discount.component.html',
  styleUrls: ['./modal-add-custom-additional-discount.component.scss']
})
export class ModalAddCustomAdditionalDiscountComponent implements OnInit {

  readonly salesItemTypeFormKey: string = "salesItemType"
  readonly salesItemGroupFormKey: string = "salesItemGroup"
  readonly salesItemFormKey: string = "salesItem"
  readonly orderedItemFormKey: string = "orderedItem"
  readonly formKey: string[] = [this.salesItemTypeFormKey, this.salesItemGroupFormKey, 
    this.salesItemFormKey, this.orderedItemFormKey]

  @Output() newCustomAdditionalDiscount = new EventEmitter<any>();

  public bsModalSalesItem?: BsModalRef
  public bsModalOrderedItem?: BsModalRef

  loadPage: boolean = false;

  newSalesItem: SalesItem = SalesItem.default()

  @Input() customAdditionalDiscountList: AdditionalDiscount[] = []

  additionalDiscount: AdditionalDiscount = AdditionalDiscount.default()

  customAdditionalDiscount: AdditionalDiscount = AdditionalDiscount.default()

  newOrderedItem: any = {}
  orderedItem: any[] = [];

  getListResponse: GetListResponse | undefined
  listTransactionLevel: TransactionLevel[] = []
  listPortionType: PortionType[] = []
  listDiscountType: DiscountType[] = []
  listSalesItemType: SalesItemType[] = []
  listSalesItemGroup: SalesItemGroup[] = []

  selectedTransactionLevel: TransactionLevel = {key: '', value: ''}
  selectedSalesItemType: SalesItemType = SalesItemType.default()
  selectedSalesItemGroup: SalesItemGroup = {key: '', value: ''}
  selectedOrderedItem: OrderedItem[] = [];
  selectedDiscountType: DiscountType = {key: '', value: ''}
  selectedPortionType: PortionType = {key: '', value: ''}

  formErrors: any;
  customAdditionalDiscountForm!: FormGroup;
  submitted = false;

  listOrderedItem: OrderedItem[] = []

  constructor(
    private generalService: GeneralService, public bsModalRef: BsModalRef, 
    public bsModalService: BsModalService, private fb: FormBuilder,
    private alertService: ModalAlertService,
    private vf: CustomAdditionalDiscountValidationFormsService) { 
      this.formErrors = this.vf.errorMessages;
      this.createForm();
  }

  ngOnInit(): void {
    this.getList()
  }

  createForm() {
    this.customAdditionalDiscountForm = this.fb.group({
      transactionLevel: ['', [Validators.required]],
      salesItemType: ['', [Validators.required, this.itemExistValidator("salesItemType")]],
      salesItemGroup: ['', [Validators.required, this.itemExistValidator("salesItemGroup")]],
      salesItem: ['', [Validators.required, this.itemExistValidator("salesItem")]],
      orderedItem: ['', [Validators.required, this.itemExistValidator("orderedItem")]],
      portionType: ['', [Validators.required]],
      discountType: ['', [Validators.required]],
      discountFactor: [0, [Validators.required, Validators.pattern(this.vf.formRules.numberOnly)]],
      notes: ['', []]
    })
  }

  itemExistValidator(transactionLevel: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      let discount;
      let id: number = 0;
      switch (transactionLevel) {
        case this.salesItemTypeFormKey:
          const salesItemType: SalesItemType = control.value;
          discount = this.customAdditionalDiscountList.find(c => 
            c.sales_item_type_id == salesItemType.sales_item_type_id && 
            c.sales_item_type_id != 0);
          id = salesItemType.sales_item_type_id;
          break;
        case this.salesItemGroupFormKey:
          const salesItemGroup: SalesItemGroup = control.value;
          discount = this.customAdditionalDiscountList.find(c => 
            c.sales_item_group_id == Number(salesItemGroup.key) && 
            c.sales_item_group_id != 0);
          id = Number(salesItemGroup.key);
          break;
        case this.salesItemFormKey:
          const salesItem: ItemList = control.value;
          discount = this.customAdditionalDiscountList.find(c => 
            c.sales_item_id == Number(salesItem.sales_item_id) && 
            c.sales_item_id != 0);
          id = Number(salesItem.sales_item_id);
          break;
        case this.orderedItemFormKey:
          // const orderedItem: OrderedItem = control.value;
          // discount = this.customAdditionalDiscountList.find(c => 
          //   c.ordered_item_id == Number(orderedItem.sales_item_id) && 
          //   c.ordered_item_id != 0);
          // id = Number(orderedItem.sales_item_id);
          break;
      }

      if (id == 0) return null;
      return discount == undefined ? null : { item_exist: true }
    }
  }

  get f() {
    return this.customAdditionalDiscountForm.controls;
  }

  reset() {
    this.submitted = false;
    this.customAdditionalDiscountForm.reset();
  }

  isFormValid(formName: string) {
    return {
      'is-invalid': this.submitted && this.f[formName].errors,
      'is-valid': this.submitted && !this.f[formName].errors 
    }
  }

  isFormError(formName: string) {
    return this.submitted && this.f[formName].errors;
  }

  getErrors(formName: string) {
    return this.f[formName].errors;
  }

  getErrorMessage(formName: string, error: any) {
    return this.formErrors[formName][error];
  }

  onValidateAddItem() {
    this.submitted = true;
    if (this.customAdditionalDiscountForm.valid) this.onAddItem();
  }

  getList(){
    this.loadPage = true;
    const params = new HttpParams()
    .set('param_list', 'discountTransactionLevelList')
    .append('param_list', 'portionTypeList')
    .append('param_list', 'discountTypeList')
    .append('param_list', 'salesItemTypeList')
    .append('param_list', 'salesItemGroupList');

    return this.generalService.getListWithParam(params)
      .subscribe((data: GetListResponse) => {
        this.getListResponse = {...data};
        if(this.getListResponse.response_code === RESPONSE_SUCCESS) {
          this.listTransactionLevel = this.getListResponse.discountTransactionLevelList
          this.listPortionType = this.getListResponse.portionTypeList
          this.listDiscountType = this.getListResponse.discountTypeList
          this.listSalesItemType = this.getListResponse.salesItemTypeList
          this.listSalesItemGroup = this.getListResponse.salesItemGroupList
          this.loadPage = false;
        } else {
          this.alertService.showModalAlert(`Failed to get prepaid list: ${this.getListResponse.response_desc}`,ALERT_DANGER)
        }
      }, err => {
        this.loadPage = false;
        this.alertService.showModalAlert(`An error has occured while get prepaid list, please contact administration`, ALERT_DANGER)
      });
  }

  transactionLevel(formName: string) {
    this.formKey.forEach(f => {
      let form = this.f[f];
      if (form.enabled) {
        form.disable();
      }
      if (f == formName) {
        form.enable();
      }
    })
  }

  onChangeTransactionLevel(selected: TransactionLevel){
    this.selectedTransactionLevel = selected;
    this.customAdditionalDiscount.transaction_level_id = Number(selected.key);
    this.customAdditionalDiscount.transaction_level_name = selected.value;

    switch (this.selectedTransactionLevel.key) {
      // Sales Item Type
      case '1':
        this.transactionLevel("salesItemType");
        break;
      // Sales Item Group
      case '2':
        this.transactionLevel("salesItemGroup");
        break;
      // Sales Item
      case '3':
        this.transactionLevel("salesItem");
        break;
      // Ordered Item
      case '4':
        this.getOrderedItem()
        this.transactionLevel("orderedItem");
        break;
    }
  }

  getOrderedItem(){
    this.listOrderedItem = []
    this.orderedItem.forEach((o: OrderedItemType) => {
      o.sales_item_list.forEach((s: OrderedItem) => {
        let custom: AdditionalDiscount | undefined = this.customAdditionalDiscountList.find(a => a.ordered_item_id == s.ar_item_id)
        if (custom == undefined) {
          let item: OrderedItem = OrderedItem.default();
          PropertyCopier.copyProperties(s, item);
          this.listOrderedItem.push(item);
        }
      });
    })
  }

  selectAllOrderedItem(e: any) {
    this.listOrderedItem.forEach((o: OrderedItem) => {
      o.checked = e.target.checked
    })
    if (e.target.checked == true) {
      this.selectedOrderedItem = this.listOrderedItem;
      this.f["orderedItem"].setValue(this.selectedOrderedItem)
    } else {
      this.selectedOrderedItem = []
      this.f["orderedItem"].setValue("")
    }
  }

  selectOrderedItem(e: any, o: OrderedItem) {
    o.checked = e.target.checked
    this.selectedOrderedItem = this.listOrderedItem.filter((o: OrderedItem) => o.checked)
    this.f["orderedItem"].setValue(this.selectedOrderedItem)
  }

  onChangeSalesItemType(selected: SalesItemType){
    this.selectedSalesItemType = selected;
    this.customAdditionalDiscount.sales_item_type_id = this.selectedSalesItemType.sales_item_type_id;
    this.customAdditionalDiscount.sales_item_type_name = this.selectedSalesItemType.sales_item_type_name;
  }

  onChangeSalesItemGroup(selected: SalesItemGroup){
    this.selectedSalesItemGroup = selected;
    this.customAdditionalDiscount.sales_item_group_id = Number(selected.key);
    this.customAdditionalDiscount.sales_item_group_name = selected.value;
  }

  onChangeDiscountType(selected: DiscountType){
    this.selectedDiscountType = selected;
    this.customAdditionalDiscount.disc_type_id = Number(selected.key);
    this.customAdditionalDiscount.disc_type_name = selected.value;
  }

  onChangePortionType(selected: PortionType){
    this.selectedPortionType = selected;
    this.customAdditionalDiscount.portion_type_id = Number(selected.key);
    this.customAdditionalDiscount.portion_type_name = selected.value;
  }

  onChangeDiscountFactor(df: any){
    this.customAdditionalDiscount.disc_factor = df;
  }

  onChangeNotes(notes: string){
    this.customAdditionalDiscount.notes = notes;
  }

  showModalSalesItem(){
    this.bsModalSalesItem = this.bsModalService.show(ModalSearchSalesItemComponent, ModalLargeConfig)

    this.bsModalSalesItem.content.selectedItem.subscribe((item: any) => {
      this.customAdditionalDiscount.sales_item_id = item.sales_item_id;
      this.customAdditionalDiscount.sales_item_name = item.sales_item_name;
      this.f["salesItem"].setValue(item);
    })

    
  }

  // showModalOrderedItem(){
  //   const initialState: ModalOptions = {
  //     initialState: {
  //       orderedItem: this.orderedItem
  //     }
  //   }
  //   this.bsModalOrderedItem = this.bsModalService.show(ModalOrderedItemComponent, Object.assign(ModalLargeConfig, initialState))

  //   this.bsModalOrderedItem.content.selectedItem.subscribe((item: OrderedItem) => {
  //     this.selectedOrderedItem = item;
  //     this.customAdditionalDiscount.ordered_item_id = item.ar_item_id;
  //     this.customAdditionalDiscount.ordered_item_name = item.sales_item_name;
  //     this.f["orderedItem"].setValue(item);
  //   })
  // }

  onAddItem() {
    let additionalDiscount: AdditionalDiscount[] = []
    if (this.selectedTransactionLevel.key == '4') {
      this.selectedOrderedItem.forEach((o: OrderedItem) => {
        let custom: AdditionalDiscount = {...this.customAdditionalDiscount}
        custom.ordered_item_id = o.ar_item_id
        custom.ordered_item_name = o.sales_item_name
        additionalDiscount.push(custom)
      })
    } else {
      additionalDiscount.push(this.customAdditionalDiscount)
    }
    this.newCustomAdditionalDiscount.emit(additionalDiscount);
    this.bsModalRef.hide();
  }

}
