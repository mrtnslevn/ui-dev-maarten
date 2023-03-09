import { HttpParams } from '@angular/common/http';
import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions, } from 'ngx-bootstrap/modal';
import { GeneralService } from 'src/app/service/general.service';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_DANGER, ITEM_ISSUE_SALES_ITEM_TYPE, PACKAGE_SALES_ITEM_TYPE, RESPONSE_SUCCESS, SALES_ITEM_CATEGORY_ITEM_ISSUE, SALES_ITEM_TYPE_BED, SALES_ITEM_TYPE_EQUIPMENT, SERVICE_SALES_ITEM_TYPE } from 'src/app/_configs/app-config';
import { CombinedBill } from '../../models/CombinedBill';
import { GetAddRemoveSalesItemResponse } from '../../models/response/GetAddRemoveSalesItemResponse';
import { GetDoctorListResponse } from '../../models/response/GetDoctorListResponse';
import { GetStoreListResponse } from '../../models/response/GetStoreListResponse';
import { GetItemAndStockPriceResponse } from '../../models/response/GetItemAndStockPriceResponse';
import { GetListResponse } from '../../models/response/GetListResponse';
import { GetPriceItemPackageResponse } from '../../models/response/GetPriceItemPackageResponse';
import { GetServicePriceResponse } from '../../models/response/GetServicePriceResponse';
import { SalesItem } from '../../models/SalesItem';
import { SalesItemType } from '../../models/SalesItemType';
import { Store } from '../../models/Store';
import { AddSalesItemValidationFormsService } from './validation-forms.service';
import { AddSalesArItemIssueRequest } from '../../models/request/AddSalesArItemIssueReq';
import { Uom } from '../../models/Uom';
import { AddSalesArItemIssueResponse } from '../../models/response/AddSalesArItemIssueResponse';
import { Doctor } from '../../models/Doctor';
import { AddSalesArItemTransactionRequest } from '../../models/request/AddSalesArItemTransactionReq';
import { AddSalesArItemTransactionResponse } from '../../models/response/AddSalesArItemTransactionResponse';
import { firstValueFrom } from 'rxjs';
import { PaymentService } from 'src/app/service/payment.service';
import { AddSalesArItemPackageRequest } from '../../models/request/AddSalesArItemPackageReq';
import { AddSalesArItemPackageResponse } from '../../models/response/AddSalesArItemPackageResponse';
import { AddSalesArItemIssueDetailRequest } from '../../models/request/AddSalesArItemIssueDetailReq';
import { AddSalesArItemTransactionDetailRequest } from '../../models/request/AddSalesArItemTransactionDetailReq';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { AddSalesArItemPackageDetailRequest } from '../../models/request/AddSalesArItemPackageDetailReq';
import { OrderedItemType } from '../../models/OrderedItemType';
import { ComboBox } from '../../models/ComboBox';
import { GetSalesItemListResponse, ItemList } from '../../models/response/GetSalesItemListResponse';
import { Paging } from '../../models/Paging';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { ModalMedicalOrderTransactionComponent } from '../modal-medical-order-transaction/modal-medical-order-transaction.component';
import { ModalExtraLargeConfig } from 'src/app/_configs/modal-config';
import { MedicalOrderTransaction } from '../../models/MedicalOrderTransaction';
import { formatDate } from '@angular/common';

@Component({
  selector: 'app-modal-add-sales-item',
  templateUrl: './modal-add-sales-item.component.html',
  styleUrls: ['./modal-add-sales-item.component.scss']
})
export class ModalAddSalesItemComponent implements OnInit {

  @Input() admissionList: CombinedBill[] = [];
  @Input() orderedItem: OrderedItemType[] = OrderedItemType.defaultArray()
  @Input() primaryDoctorUserId: string = '';
  @Input() patientEmail: string = '';
  @Input() patientId: number = 0
  @Input() selectedSalesItemCategory: ComboBox = ComboBox.default()

  @Output() dataSalesItem = new EventEmitter<any>();

  public bsAnotherModalRef?: BsModalRef;
  bsModalShowAlert?: BsModalRef

  listDoctor: Array<Doctor> = []

  selectedDoctor: Doctor = Doctor.default()
  selectedAdmission: CombinedBill = CombinedBill.default();

  listSalesItemType: Array<SalesItemType> = []
  listSalesItemCategory: ComboBox[] = []
  selectedSalesItemType: SalesItemType = SalesItemType.default()
  listStore: Store[] = []
  selectedStore: Store = Store.default();
  stock: number = 0
  price: number = 0
  uom: Uom[] = []

  showStartDate: boolean = false
  showEndDate: boolean = false
  dataTable: Array<SalesItem> = []

  newSalesItem: SalesItem = SalesItem.default()

  loadPage: boolean = true;
  add: boolean = false;

  getListResponse!: GetListResponse
  getItemAndStockPriceResponse: GetItemAndStockPriceResponse | undefined
  getServicePriceResponse!: GetServicePriceResponse
  getPriceItemPackageResponse!: GetPriceItemPackageResponse
  getStoreListResponse!: GetStoreListResponse
  getAddRemoveSalesItemResponse!: GetAddRemoveSalesItemResponse
  getDoctorListResponse!: GetDoctorListResponse
  addSalesArItemIssueResponse!: AddSalesArItemIssueResponse
  addSalesArItemTransactionResponse!: AddSalesArItemTransactionResponse

  salesItemForm!: FormGroup;
  submitted = false;
  searchSalesItemDisabled: boolean = false
  formErrors: any;

  orgId: number = 0
  hopeUserId: number = 0

  showIsCito: boolean = false
  showStore: boolean = false
  isCito: number = 0;

  saveProgress: boolean = false
  primaryDoctor: Doctor = Doctor.default()

  getSalesItemParams = new HttpParams()
  getSalesItemListResponse: GetSalesItemListResponse | undefined;
  total_row: number = 0
  itemPerPage: number = 0;
  current_page: number = 1;
  page?: number;
  paging: Paging = new Paging(0, 0, 0, 0, 0);
  salesItemList: ItemList[] = []
  selectedSalesItem: any
  disableSalesItem: boolean = true
  selectedEmail: string = ''

  bsModalMedicalOrder?: BsModalRef
  itemMedicalOrder: MedicalOrderTransaction[] = []

  constructor(public bsModalRef: BsModalRef,
    public bsModalService: BsModalService, private fb: FormBuilder,
    private vf: AddSalesItemValidationFormsService,
    private token: TokenStorageService,
    private generalService: GeneralService,
    private paymentService: PaymentService,
    private alertService: ModalAlertService) {
    this.createForm();
    this.formErrors = this.vf.errorMessages;
  }

  ngOnInit(): void {
    this.getDoctorList()
    this.getStoreList();

    if(this.selectedSalesItemCategory.key!='1') {
      this.salesItemFormControls["store"].removeValidators([Validators.required])
      this.salesItemFormControls["email"].setValue(this.patientEmail)
      this.getDataSalesItem()
    }
    // else{
    //   this.salesItemFormControls["salesItemName"].disable()
    // }
    
    const userData = this.token.getUserData();
    this.orgId = userData.hope_organization_id
    this.hopeUserId = userData.hope_user_id
    this.salesItemFormControls["admissionNo"].setValue(this.admissionList[0])
    this.selectedAdmission = this.admissionList[0]
    this.newSalesItem.admission_no = this.admissionList[0].admission_no;
    this.newSalesItem.admission_id = this.admissionList[0].admission_id;
  }

  getTodaysDate() {
    return formatDate(Date.now(), "yyyy-MM-dd", "en-US")
  }

  createForm() {
    this.salesItemForm = this.fb.group({
      admissionNo: ['', [Validators.required]],
      store: ['', [Validators.required]],
      doctor: ['', [Validators.required]],
      notes: [''],
      email: [''],
      salesItemName: ['']
    });
  }

  get salesItemFormControls() {
    return (this.salesItemForm.controls);
  }

  reset() {
    this.submitted = false;
    this.newSalesItem = SalesItem.default()
    this.salesItemFormControls["admissionNo"].setValue(this.admissionList[0])
    this.selectedAdmission = this.admissionList[0]
    this.newSalesItem.admission_no = this.admissionList[0].admission_no;
    this.newSalesItem.admission_id = this.admissionList[0].admission_id
    this.newSalesItem.doctor = this.primaryDoctor
    this.newSalesItem.store = this.selectedStore
    this.newSalesItem.email_address = this.selectedEmail
  }

  isSalesItemFormValid(formName: string) {
    return {
      'is-invalid': this.submitted && this.salesItemFormControls[formName].errors,
      'is-valid': this.submitted && !this.salesItemFormControls[formName].errors
    }
  }

  isSalesItemFormError(formName: string) {
    return (this.submitted) && this.salesItemFormControls[formName].errors;
  }

  getSalesItemFormError(formName: string) {
    return this.salesItemFormControls[formName].errors;
  }

  getErrorMessage(formName: string, error: any): string {
    return this.formErrors[formName][error];
  }

  getDoctorList() {
    return this.generalService.getDoctorList()
      .subscribe((data: GetDoctorListResponse) => {
        this.getDoctorListResponse = { ...data }
        if (this.getDoctorListResponse.response_code === RESPONSE_SUCCESS) {
          this.listDoctor = this.getDoctorListResponse.doctor_list;
          for(var i = 0; i < this.listDoctor.length; i++) {
            if(this.listDoctor[i].doctor_id==this.primaryDoctorUserId) {
              this.primaryDoctor = this.listDoctor[i]
              this.salesItemFormControls["doctor"].setValue(this.listDoctor[i])
            }
          }
        } else {
          this.alertService.showModalAlert(`Failed to get doctor list: ${this.getDoctorListResponse.response_desc}`, ALERT_DANGER)
        }
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get doctor list, please contact administration`, ALERT_DANGER)

      });
  }

  getStoreList() {
    const params = new HttpParams();
    return this.generalService.getStoreList(params)
      .subscribe((data) => {
        this.getStoreListResponse = {...data}
        if (this.getStoreListResponse.response_code === RESPONSE_SUCCESS) {
          this.listStore = this.getStoreListResponse.store_list;
        } else {
          this.alertService.showModalAlert(`Failed to get store list: ${this.getStoreListResponse.response_desc}`, ALERT_DANGER)
        }
        this.loadPage = false;
      }, err => {
        this.alertService.showModalAlert(`An error has occured while get store list, please contact administration`, ALERT_DANGER)
        this.loadPage = false;
      });
  }

  getDataSalesItem(){
    if (this.selectedAdmission.lob_id > 0) {
      this.getSalesItemParams = this.getSalesItemParams.set("lob_id", this.selectedAdmission.lob_id);
    }
    if (this.selectedSalesItemCategory != null && this.selectedSalesItemCategory.key != "") {
      this.getSalesItemParams = this.getSalesItemParams.set("sales_item_category_id", this.selectedSalesItemCategory.key)
    }
    if (this.selectedStore != null && this.selectedStore.store_id != 0) {
      this.getSalesItemParams = this.getSalesItemParams.set("store_id", this.selectedStore.store_id);
    }
    // this.getSalesItemParams = this.getSalesItemParams.set("sales_item_name", 'COVID TESTING');
    return this.paymentService.getSalesItem(this.getSalesItemParams)
      .subscribe((data)=>
      {
        this.getSalesItemListResponse = {...data};
        if(this.getSalesItemListResponse?.response_code == RESPONSE_SUCCESS) {
          this.salesItemList = this.getSalesItemListResponse.sales_item_list;
          PropertyCopier.copyProperties(this.getSalesItemListResponse.paging, this.paging);
          this.disableSalesItem = false
          // if (event != undefined) this.page = event.page
        } else {
          this.alertService.showModalAlertError(`Failed to get sales item list with error: ${this.getSalesItemListResponse?.response_desc}`)
        }
        // if (event != undefined) this.page = event.page;
      }, err => {
        if (this.getSalesItemListResponse?.response_desc != undefined) {
          this.alertService.showModalAlertError(`Failed to get sales item list with error: ${this.getSalesItemListResponse.response_desc}`)
        } else {
          this.alertService.showModalAlertError(`Failed to get sales item list, please contact administration`)
        }
      });
  }

  getPriceandStockItem(item: ItemList) {
      this.newSalesItem.sales_item_id = item.sales_item_id
      this.newSalesItem.sales_item_name = item.sales_item_name;
      this.newSalesItem.sales_item_code = item.sales_item_code;
      this.newSalesItem.notes = this.newSalesItem.general_notes;

      this.newSalesItem.sales_item_type = {
        sales_item_type_id: item.sales_item_type_id,
        sales_item_type_name: item.sales_item_type_name,
        is_item_issue: item.sales_item_category_id
      }
      
      let data: OrderedItemType | undefined = this.orderedItem.find(o => o.sales_item_type_id == this.newSalesItem.sales_item_type.sales_item_type_id)
      let defaultEmail: string = data != undefined ? data.email_to : this.patientEmail

      if (this.newSalesItem.sales_item_type.sales_item_type_id == 2 || 
        this.newSalesItem.sales_item_type.sales_item_type_id == 3) {
          this.salesItemFormControls["email"].setValue(defaultEmail)
          this.newSalesItem.email_address = defaultEmail
      } else {
        this.salesItemFormControls["email"].setValue(defaultEmail)
        this.newSalesItem.email_address = defaultEmail
      }

      this.uom = item.uom_list
      this.newSalesItem.uom = this.uom[0]
      this.newSalesItem.uom_list = this.uom

      // Other Item
      // Consumable
      // Drug
      if (this.isItemIssueSalesItemType()) {
        this.getStockPrice(item);
      } else if (this.isServiceSalesItemType()) {
        this.getServicePrice(item)
      } else if (this.isPackageSalesItemType()) {
        this.getPriceItemPackage(item)
      }
  }

  updateStock(stock: number) {
    let salesItem = {...this.newSalesItem}
    salesItem.stock = stock
    this.newSalesItem = salesItem
  }

  getStockPrice(item: ItemList) {
    this.loadPage = true;
    let params = new HttpParams();
    params = params.set("store_id", this.selectedStore.store_id)
    params = params.set("item_id", this.newSalesItem.sales_item_id);
    params = params.set("admission_id", this.selectedAdmission.admission_id)
    params = params.set("organization_id", this.orgId)

    return this.paymentService.getItemStockAndPrice(params)
      .subscribe((data: GetItemAndStockPriceResponse) => {
        this.getItemAndStockPriceResponse = { ...data };
        if (this.getItemAndStockPriceResponse.response_code == RESPONSE_SUCCESS) {

          this.newSalesItem.stock = this.getItemAndStockPriceResponse.stock

          this.updateStock(this.getItemAndStockPriceResponse.stock)

          this.newSalesItem.price_per_item = this.getItemAndStockPriceResponse.price;
          this.newSalesItem.default_price = this.getItemAndStockPriceResponse.price;
          this.addDataToTable(item)
        } else {
          this.newSalesItem.stock = 0
          this.updateStock(0)
          this.newSalesItem.quantity = 0
          this.newSalesItem.price_per_item = 0
          this.alertService.showModalAlert(`Failed to get stock price: ${this.getItemAndStockPriceResponse.response_desc}`, ALERT_DANGER)
        }
        this.loadPage = false;
      }, err => {
        this.newSalesItem.stock = 0
        this.updateStock(0)
        this.newSalesItem.quantity = 0
        this.newSalesItem.price_per_item = 0
        this.alertService.showModalAlert(`An error has occured while get stock price, please contact administration`, ALERT_DANGER)

        this.loadPage = false;
      });
  }

  getServicePrice(item: ItemList) {
    this.newSalesItem.start_date = this.getTodaysDate()
    this.newSalesItem.end_date = this.getTodaysDate()
    this.newSalesItem.is_cito = 0
    this.loadPage = true
    let params = new HttpParams()
    params = params.set("organization_id", this.orgId);
    params = params.set("admission_id", this.selectedAdmission.admission_id)
    params = params.set("cito", this.isCito)
    params = params.set("sales_item_id", this.newSalesItem.sales_item_id)

    this.paymentService.getServicePrice(params)
      .subscribe((data: GetServicePriceResponse) => {
        this.getServicePriceResponse = { ...data }
        if (this.getServicePriceResponse.response_code == RESPONSE_SUCCESS) {

          this.newSalesItem.price_per_item = this.getServicePriceResponse.price
          this.addDataToTable(item)
        } else {
          this.newSalesItem.price_per_item = 0
          this.alertService.showModalAlertError(`Failed to get Price item for ${this.newSalesItem.admission_no} - ${this.newSalesItem.sales_item_name}`)
        }
        this.loadPage = false
    }, err => {
      this.newSalesItem.price_per_item = 0
      this.alertService.showModalAlertError(`Failed to get Price item for ${this.newSalesItem.admission_no} - ${this.newSalesItem.sales_item_name}`)

      this.loadPage = false
    })
  }

  getServicePriceMedicalOrder(item: MedicalOrderTransaction) {
    console.log('item',item)
    this.loadPage = true

    PropertyCopier.copyProperties(item, this.newSalesItem);

    let params = new HttpParams()
    params = params.set("organization_id", this.orgId);
    params = params.set("admission_id", this.selectedAdmission.admission_id)
    params = params.set("cito", this.isCito)
    params = params.set("sales_item_id", this.newSalesItem.sales_item_id)

    this.paymentService.getServicePrice(params)
      .subscribe((data: GetServicePriceResponse) => {
        this.getServicePriceResponse = { ...data }
        if (this.getServicePriceResponse.response_code == RESPONSE_SUCCESS) {

          this.newSalesItem.price_per_item = this.getServicePriceResponse.price
          this.addDataFromMedicalOrder(item)
        } else {
          this.newSalesItem.price_per_item = 0
          this.alertService.showModalAlertError(`Failed to get Price item for ${this.newSalesItem.admission_no} - ${this.newSalesItem.sales_item_name}`)
        }
        this.loadPage = false
    }, err => {
      this.newSalesItem.price_per_item = 0
      this.alertService.showModalAlertError(`Failed to get Price item for ${this.newSalesItem.admission_no} - ${this.newSalesItem.sales_item_name}`)

      this.loadPage = false
    })
  }

  getPriceItemPackage(item: ItemList) {
    this.newSalesItem.start_date = this.getTodaysDate()
    this.newSalesItem.end_date = this.getTodaysDate()
    this.loadPage = true
    let params = new HttpParams()
    params = params.set("organization_id", this.orgId)
    params = params.set("admission_id", this.selectedAdmission.admission_id)
    params = params.set("package_sales_item_id", this.newSalesItem.sales_item_id)

    this.paymentService.getPriceItemPackage(params)
      .subscribe((data: GetPriceItemPackageResponse) => {
        this.getPriceItemPackageResponse = { ...data }
        if (this.getPriceItemPackageResponse.response_code == RESPONSE_SUCCESS) {

          this.newSalesItem.is_cito = 0
          this.newSalesItem.price_per_item = this.getPriceItemPackageResponse.price
          this.addDataToTable(item)
        } else {
          this.newSalesItem.price_per_item = 0
          this.alertService.showModalAlertError(`Failed to get Price item for ${this.newSalesItem.admission_no} - ${this.newSalesItem.sales_item_name}`)
          
        }
        this.loadPage = false
    }, err => {
      this.newSalesItem.price_per_item = 0
      this.alertService.showModalAlertError(`Failed to get Price item for ${this.newSalesItem.admission_no} - ${this.newSalesItem.sales_item_name}`)

      this.loadPage = false
    })
  }

  onChangeAdmissionNo(selected: CombinedBill) {
    if (selected != null) {
      this.selectedAdmission = selected;
      this.newSalesItem.admission_no = this.selectedAdmission.admission_no;
      this.newSalesItem.admission_id = this.selectedAdmission.admission_id
    }
  }

  onChangeDoctor(selected: Doctor) {
    this.newSalesItem.doctor = selected;
  }

  onChangeSalesItem(event: ItemList){
    this.selectedSalesItem = event
    this.getPriceandStockItem(event)
  }

  onKeyUpSalesItem(event: any){
    if (event.target.value.length>=3){
      this.getSalesItemParams = this.getSalesItemParams.set('sales_item_name', event.target.value)
      this.getDataSalesItem()
    }
  }

  onClickSalesItem(event: any){
    this.submitted = true;
  }

  onChangeUom(uom: Uom, index: number) {
    if (uom.uom_ratio != undefined) {
      this.dataTable[index].price_per_item = this.dataTable[index].default_price * uom.uom_ratio
    } else {
      this.dataTable[index].price_per_item = this.dataTable[index].default_price
    }
  }

  onChangeStore(selected: Store) {
    this.selectedStore = selected != null ? selected : Store.default()
    this.newSalesItem.store = this.selectedStore
    this.salesItemFormControls["salesItemName"].enable()
    this.getDataSalesItem()
  }

  onChangeQuantity(qty: number) {
    this.newSalesItem.quantity = qty;
  }

  onChangeNotes(selected: any) {
    this.newSalesItem.notes = selected;
  }

  onChangeGeneralNotes(notes: string) {
    this.newSalesItem.general_notes = notes;
  }

  onChangeEmail(email: string) {
    this.selectedEmail = email
    this.newSalesItem.email_address = this.selectedEmail
  }

  isItemIssueSalesItemCategory() {
    return this.selectedSalesItemCategory.key == SALES_ITEM_CATEGORY_ITEM_ISSUE
  }

  isItemIssueSalesItemType(salesItemTypeId?: number): boolean {
    if (salesItemTypeId == undefined) salesItemTypeId = this.newSalesItem.sales_item_type.sales_item_type_id
    return ITEM_ISSUE_SALES_ITEM_TYPE.includes(salesItemTypeId)
  }

  isServiceSalesItemType(salesItemTypeId?: number): boolean {
    if (salesItemTypeId == undefined) salesItemTypeId = this.newSalesItem.sales_item_type.sales_item_type_id
    return SERVICE_SALES_ITEM_TYPE.includes(salesItemTypeId)
  }

  isPackageSalesItemType(salesItemTypeId?: number): boolean {
    if (salesItemTypeId == undefined) salesItemTypeId = this.newSalesItem.sales_item_type.sales_item_type_id
    return PACKAGE_SALES_ITEM_TYPE.includes(salesItemTypeId)
  }

  addDataToTable(item: ItemList) {
    let salesItemTypeId: number = this.newSalesItem.sales_item_type.sales_item_type_id
    // PropertyCopier.copyProperties(item, this.newSalesItem);
    this.newSalesItem.quantity = 1
    if (this.isServiceSalesItemType(salesItemTypeId) || this.isPackageSalesItemType(salesItemTypeId)) {
      let data: OrderedItemType | undefined = this.orderedItem.find(o => o.sales_item_type_id == salesItemTypeId)
      if (salesItemTypeId == 2 || salesItemTypeId == 3) {
        this.newSalesItem.email_type_id = 3
      } else {
        this.newSalesItem.email_type_id = 1
        this.newSalesItem.email_address = data != undefined && data.email_to != null ? data.email_to : ""
      }
    }
    this.dataTable.push(this.newSalesItem)
    this.reset()
  }

  addDataFromMedicalOrder(i: MedicalOrderTransaction){
    let order_date = i.order_date.split("T");
    this.newSalesItem.start_date = order_date[0]
    this.newSalesItem.end_date = order_date[0]
    this.newSalesItem.sales_item_type = SalesItemType.default()
    this.newSalesItem.sales_item_type.sales_item_type_id = i.sales_item_type_id
    this.newSalesItem.cpoe_trans_id = i.cpoe_trans_id;
    this.newSalesItem.encounter_id = i.encounter_id
    this.newSalesItem.sales_item_name = i.sales_item_name
    this.newSalesItem.sales_item_id = i.sales_item_id
    let salesItemTypeId: number = i.sales_item_type_id
    let doctor = this.listDoctor.find(d => d.doctor_id == i.doctor_id)
    if(doctor!=undefined){
      this.newSalesItem.doctor = doctor
    }
    this.newSalesItem.is_cito = i.is_cito
    if (this.isServiceSalesItemType(salesItemTypeId) || this.isPackageSalesItemType(salesItemTypeId)) {
      let data: OrderedItemType | undefined = this.orderedItem.find(o => o.sales_item_type_id == salesItemTypeId)
      if (salesItemTypeId == 2 || salesItemTypeId == 3) {
        this.newSalesItem.email_type_id = 3
      } else {
        this.newSalesItem.email_type_id = 1
        this.newSalesItem.email_address = data != undefined && data.email_to != null ? data.email_to : ""
      }
    }
    console.log('before add',this.newSalesItem)
    this.dataTable.push(this.newSalesItem)
    this.reset()
  }

  removeSalesItem(salesItem: SalesItem) {
    this.dataTable = this.dataTable.filter((i: SalesItem) => i !== salesItem);
  }

  showModalMedicalOrderTransaction(){
    const initialState: ModalOptions = {
      initialState: {
        admissionId: this.selectedAdmission.admission_id,
        patientId: this.patientId
      }
    }
    this.bsModalMedicalOrder = this.bsModalService.show(ModalMedicalOrderTransactionComponent, Object.assign(ModalExtraLargeConfig, initialState));

    this.bsModalMedicalOrder.content.dataOutputMedicalOrderTransaction.subscribe((item: MedicalOrderTransaction[]) => {
      this.itemMedicalOrder = item
      this.itemMedicalOrder.forEach(i => {
        this.getServicePriceMedicalOrder(i)
      })
    })
  }

  onSave() {
    this.alertService.showModalConfirm("Are you sure want to save all this item?").content.isConfirm
    .subscribe(async (isConfirm: boolean) => {
      await this.saveDataSalesItem()
    })
  }

  async saveDataSalesItem() {
    this.saveProgress = true

    let itemIssueSalesItem: SalesItem[] = this.dataTable.filter(d => this.isItemIssueSalesItemType(d.sales_item_type.sales_item_type_id))
    let transactionSalesItem: SalesItem[] = this.dataTable.filter(d => this.isServiceSalesItemType(d.sales_item_type.sales_item_type_id))
    let packageSalesItem: SalesItem[] = this.dataTable.filter(d => this.isPackageSalesItemType(d.sales_item_type.sales_item_type_id))

    await this.addSalesArItemIssue(itemIssueSalesItem)

    await this.addSalesArItemTransaction(transactionSalesItem)

    await this.addSalesArItemPackage(packageSalesItem)

    this.saveProgress = false

    this.dataSalesItem.emit(this.dataTable);
    this.bsModalRef.hide(); 
  }

  createAddSalesArItemIssueMessage(success: boolean, req: AddSalesArItemIssueRequest, resp: AddSalesArItemIssueResponse) {
    let msg = `${success == true ? 'Successfully' : 'Failed to'} Add sales item with Admission No. ${req.admission_no} for sales item `;
    for (let i = 0; i < req.item_details.length; i++) {
      if (i == req.item_details.length - 1) {
        msg += `${req.item_details[i].item_name} `
      } else {
        msg += `${req.item_details[i].item_name}, `
      }
    }
    if (!success && resp.response_desc != undefined) msg += `With error: ${resp.response_desc}`
    return msg;
  }

  createAddSalesArItemTransactionMessage(success: boolean, req: AddSalesArItemTransactionRequest, resp: AddSalesArItemTransactionResponse) {
    let msg = `${success == true ? 'Successfully' : 'Failed to'} Add sales item with Admission No. ${req.admission_no} for sales item `;
    for (let i = 0; i < req.list_item_transaction.length; i++) {
      if (i == req.list_item_transaction.length - 1) {
        msg += `${req.list_item_transaction[i].item_name} `
      } else {
        msg += `${req.list_item_transaction[i].item_name}, `
      }
    }
    if (!success && resp.response_desc != undefined) msg += `With error: ${resp.response_desc}`
    return msg;
  }

  createAddSalesArItemPackageMessage(success: boolean, req: AddSalesArItemPackageRequest, resp: AddSalesArItemPackageResponse) {
    let msg = `${success == true ? 'Successfully' : 'Failed to'} Add sales item with Admission No. ${req.admission_no} for sales item `;
    for (let i = 0; i < req.list_package_item.length; i++) {
      if (i == req.list_package_item.length - 1) {
        msg += `${req.list_package_item[i].item_name} `
      } else {
        msg += `${req.list_package_item[i].item_name}, `
      }
    }
    if (!success && resp.response_desc != undefined) msg += `With error: ${resp.response_desc}`
    return msg;
  }

  async addSalesArItemIssue(salesItem: SalesItem[]) {
    let salesItemArray: AddSalesArItemIssueRequest[] = []
    for (let i = 0; i < salesItem.length; i++) {
      let item: SalesItem = salesItem[i]
      let indexof: number = salesItemArray.findIndex(s => 
        s.admission_id == item.admission_id && s.doctor_user_id == Number(item.doctor.doctor_id) && s.store_id == item.store.store_id)
      
      if (indexof === -1) {
        let newObj: AddSalesArItemIssueRequest = {
          organization_id: this.orgId,
          admission_id: item.admission_id,
          admission_no: item.admission_no,
          store_id: item.store.store_id,
          user_id: this.hopeUserId,
          doctor_user_id: Number(item.doctor.doctor_id),
          notes: item.general_notes,
          item_details: [
            {
              item_id: item.sales_item_id,
              item_name: item.sales_item_name,
              quantity: item.quantity!,
              uom_id: item.uom?.uom_id!,
              notes: item.notes
            }
          ]
        }
        salesItemArray.push(newObj)
      } else {
        let newObj: AddSalesArItemIssueDetailRequest = {
          item_id: item.sales_item_id,
          item_name: item.sales_item_name,
          quantity: item.quantity!,
          uom_id: item.uom?.uom_id!,
          notes: item.general_notes
        }
        salesItemArray[indexof].item_details.push(newObj)
      }

    }

    for (let i = 0; i < salesItemArray.length; i++) {
      let req: AddSalesArItemIssueRequest = salesItemArray[i]
      await firstValueFrom(this.paymentService.addSalesArItemIssue(req)).then((resp: AddSalesArItemIssueResponse) => {
        if (resp.response_code == RESPONSE_SUCCESS) {
          
          this.alertService.showModalAlertSuccess(this.createAddSalesArItemIssueMessage(true, req, resp));
        } else {
          this.alertService.showModalAlertError(this.createAddSalesArItemIssueMessage(false, req, resp))
        }
      })
      .catch((err: AddSalesArItemIssueResponse) => {
        this.alertService.showModalAlertError(this.createAddSalesArItemIssueMessage(false, req, err))
      })
    }
  }

  async addSalesArItemTransaction(salesItem: SalesItem[]) {
    let salesItemArray: AddSalesArItemTransactionRequest[] = []
    for (let i = 0; i < salesItem.length; i++) {
      let item: SalesItem = salesItem[i]
      let indexof: number = salesItemArray.findIndex(s => 
        s.admission_id == item.admission_id && s.doctor_user_id == Number(item.doctor.doctor_id))
      
      if (indexof === -1) {
        let newObj: AddSalesArItemTransactionRequest = {
          organization_id: this.orgId,
          admission_id: item.admission_id,
          admission_no: item.admission_no,
          user_id: this.hopeUserId,
          email_type_id: item.email_type_id!,
          email_address: item.email_address,
          doctor_user_id: Number(item.doctor.doctor_id),
          notes: item.general_notes,
          list_item_transaction: [
            {
              item_id: item.sales_item_id,
              item_name: item.sales_item_name,
              quantity: 1,
              is_cito: item.is_cito!,
              notes: item.notes,
              start_date: item.start_date!,
              end_date: item.end_date,
              cpoe_trans_id: item.cpoe_trans_id,
              encounter_id: item.encounter_id
            }
          ]
        }
        salesItemArray.push(newObj)
      } else {
        let newObj: AddSalesArItemTransactionDetailRequest = {
          item_id: item.sales_item_id,
          item_name: item.sales_item_name,
          quantity: 1,
          is_cito: item.is_cito!,
          notes: item.general_notes,
          start_date: item.start_date!,
          end_date: item.end_date,
          cpoe_trans_id: item.cpoe_trans_id,
          encounter_id: item.encounter_id
        }
        salesItemArray[indexof].list_item_transaction.push(newObj)
      }

    }

    for (let i = 0; i < salesItemArray.length; i++) {
      let req: AddSalesArItemTransactionRequest = salesItemArray[i]
      await firstValueFrom(this.paymentService.addSalesArItemTransaction(req))
      .then((resp: AddSalesArItemTransactionResponse) => {
        if (resp.response_code == RESPONSE_SUCCESS) {
          this.alertService.showModalAlertSuccess(this.createAddSalesArItemTransactionMessage(true, req, resp))
        } else {
          this.alertService.showModalAlertError(this.createAddSalesArItemTransactionMessage(false, req, resp))
        }
      })
      .catch((err: AddSalesArItemTransactionResponse) => {
        this.alertService.showModalAlertError(this.createAddSalesArItemTransactionMessage(false, req, err))
      })
    }
  }

  async addSalesArItemPackage(salesItem: SalesItem[]) {
    let salesItemArray: AddSalesArItemPackageRequest[] = []
    for (let i = 0; i < salesItem.length; i++) {
      let item: SalesItem = salesItem[i]
      let indexof: number = salesItemArray.findIndex(s => 
        s.admission_id == item.admission_id && s.doctor_user_id == Number(item.doctor.doctor_id) && s.store_id == item.store.store_id)
      
      if (indexof === -1) {
        let newObj: AddSalesArItemPackageRequest = {
          organization_id: this.orgId,
          admission_id: item.admission_id,
          admission_no: item.admission_no,
          user_id: this.hopeUserId,
          email_type_id: item.email_type_id!,
          email_address: item.email_address,
          doctor_user_id: Number(item.doctor.doctor_id),
          notes: item.general_notes,
          list_package_item: [
            {
              item_id: item.sales_item_id,
              item_name: item.sales_item_name,
              quantity: 1,
              notes: item.notes
            }
          ]
        }
        if (this.selectedStore.store_id != 0) newObj.store_id = this.selectedStore.store_id
        salesItemArray.push(newObj)
      } else {
        let newObj: AddSalesArItemPackageDetailRequest = {
          item_id: item.sales_item_id,
          item_name: item.sales_item_name,
          quantity: 1,
          notes: item.general_notes
        }
        salesItemArray[indexof].list_package_item.push(newObj)
      }

    }

    for (let i = 0; i < salesItemArray.length; i++) {
      let req: AddSalesArItemPackageRequest = salesItemArray[i]
      await firstValueFrom(this.paymentService.addSalesArItemPackage(req))
      .then(resp => {
        if (resp.response_code == RESPONSE_SUCCESS) {
          this.alertService.showModalAlertSuccess(this.createAddSalesArItemPackageMessage(true, req, resp))
        } else {
          this.alertService.showModalAlertError(this.createAddSalesArItemPackageMessage(false, req, resp))
        }
      })
      .catch((err: AddSalesArItemPackageResponse) => {
        this.alertService.showModalAlertError(this.createAddSalesArItemPackageMessage(false, req, err))
      })
    }
  }
}
