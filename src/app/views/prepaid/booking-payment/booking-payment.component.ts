import { HttpParams } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalPackageComponent } from 'src/app/general/general-modal/modal-package/modal-package.component';
import { ModalValidasiUserComponent } from 'src/app/general/general-modal/modal-validasi-user/modal-validasi-user.component';
import { ModalViewScheduleDoctorComponent } from 'src/app/general/general-modal/modal-view-schedule-doctor/modal-view-schedule-doctor.component';
import { ModalSearchSalesItemComponent } from 'src/app/general/general-modal/modal-search-sales-item/modal-search-sales-item.component';
import { ModalSendPrintComponent } from 'src/app/general/general-modal/modal-send-print/modal-send-print.component';
import { BookingInformation } from 'src/app/general/models/BookingInformation';
import { CovidTestDetail } from 'src/app/general/models/CovidTestDetail';
import { CovidTestingSchedule } from 'src/app/general/models/CovidTestingSchedule';
import { CovidTestingType } from 'src/app/general/models/CovidTestingType';
import { Bank_Transfer } from 'src/app/general/models/div-card-payment/Bank_Transfer';
import { Cash } from 'src/app/general/models/div-card-payment/Cash';
import { Digital_Payment } from 'src/app/general/models/div-card-payment/Digital_Payment';
import { Edc } from 'src/app/general/models/div-card-payment/Edc';
import { Giro } from 'src/app/general/models/div-card-payment/Giro';
import { Payer } from 'src/app/general/models/div-card-payment/Payer';
import { Qris } from 'src/app/general/models/div-card-payment/Qris';
import { Doctor } from 'src/app/general/models/Doctor';
import { DoctorSchedule } from 'src/app/general/models/DoctorSchedule';
import { Invoice } from 'src/app/general/models/Invoice';
import { MedicalOrder } from 'src/app/general/models/MedicalOrder';
import { OpdDetail } from 'src/app/general/models/OpdDetail';
import { Package } from 'src/app/general/models/Package';
import { Payment } from 'src/app/general/models/Payment';
import { PaymentMode, PaymentModePayment } from 'src/app/general/models/PaymentMode';
import { Payment_Settlement } from 'src/app/general/models/Payment_Settlement';
import { SavePaymentPrepaidRequest } from 'src/app/general/models/request/SavePaymentReq';
import { Service } from 'src/app/general/models/Service';
import { Specialization } from 'src/app/general/models/Specialization';
import { TimeSlot } from 'src/app/general/models/TimeSlot';
import { TokenStorageService } from 'src/app/_auth/token-storage.service';
import { ALERT_WARNING, COVID_TESTING, MCU, OPD } from 'src/app/_configs/app-config';
import { ModalDefaultConfig, ModalLargeConfig } from 'src/app/_configs/modal-config';
import { SavePaymentUtils } from '../../../_helpers/SavePaymentUtils';
import { BookingPaymentRepository } from './booking-payment-repository.service';
import { BookingPaymentValidationFormsService } from './validation-forms.service';
import { v4 as uuidv4 } from 'uuid';
import { TimeSlotList } from 'src/app/general/models/TimeSlotList';
import { formatDate } from '@angular/common';
import { ModalAlertConfirmComponent } from 'src/app/general/general-modal/modal-alert-confirm/modal-alert-confirm.component';
import { Patient } from 'src/app/general/models/Patient';
import { ModalAlertService } from 'src/app/service/modal-alert.service';

@Component({
  selector: 'app-booking-payment',
  templateUrl: './booking-payment.component.html',
  styleUrls: ['./booking-payment.component.scss']
})
export class BookingPaymentComponent implements OnInit {
  org_id: number = 0
  hospital_id: string = ''
  hospital_hope_id: number = 0
  patient: Patient = Patient.default()
  patientId: number = 0

  bsModalMedicalOrder?: BsModalRef;
  bsModalSendPrint?: BsModalRef;
  editable: boolean = false

  selectedInputBooking: string = ""
  loadNewBooking: boolean = false

  showTableMedicalOrder: boolean = false
  showInputManually: boolean = false
  showFooter: boolean = false

  dataMedicalOrder: MedicalOrder[] = []
  total_row: number = 0
  itemPerPage: number = 10;

  readPackage: boolean = true
  readCovidTestingType: boolean = true
  readSpecialization: boolean = true
  readDoctorName: boolean = true
  disabledViewSchedule: boolean = true
  disabledAppointmentDate: boolean = false
  readAppointmentTime: boolean = true
  disabledAppointmentTimeSlot: boolean = false
  disabledAppointmentTimeCovid: boolean = false

  listService: Service[] = []
  selectedService: Service = {key: '', value: ''}
  serviceType: string = ''
  listSpecialization: Specialization[] = []
  selectedSpecialization: Specialization = Specialization.default()
  listDoctor: Doctor[] = []
  selectedDoctor: Doctor = Doctor.default()
  listAppointmentTime: any[] = []
  selectedAppointmentTime: any = {}
  selectedAppointmentDate: any
  day: string = ''

  isCovidSelected: boolean = false
  listCovidTestingType: CovidTestingType[] = []
  selectedCovidTestingType: any = {}
  covidTestDetail: CovidTestDetail = CovidTestDetail.default()
  isDriveThru: boolean = false
  listCovidTestingSchedule: CovidTestingSchedule[] = []
  selectedAppointmentTimeCovidTesting: CovidTestingSchedule = CovidTestingSchedule.default()
  disabledAddBooking: boolean = false

  bsModalRef?: BsModalRef
  bsModalRefViewSchedule?: BsModalRef
  typePackage: string = ''
  checkupIdCovidTesting: string = ''
  package: Package = Package.default()

  listScheduledDoctor: DoctorSchedule[] = []
  schedule: any

  payload: BookingInformation = BookingInformation.default()
  bookingInformation: BookingInformation[] = []
  loadSaveBookingInformation: boolean = false

  loadInvoiceCard: boolean = false
  loadSaveInvoiceButton: boolean = false

  prepaidId: string = ''
  prepaidDate: string = ''
  gross: number = 0
  net: number = 0
  balance: number = 0
  listDiscountType = [{key: '', value: ''}]
  selectedDiscountType = {key: '', value: ''}
  discountFactor: number = 0
  discountAmount: number = 0

  public invoice: Invoice = Invoice.default();
  public paymentSettlementParams = new HttpParams()

  @ViewChild("appBookingPayment", {read: ElementRef}) appBookingPayment!: ElementRef;
  inputs: any[] = [];
  listInputId: string[] = ["btn-export-combined-bill", "btn-export-ordered-item"];

  paymentForm!: FormGroup;
  submitted: boolean = false;
  formErrors: any;

  invoiceForm!: FormGroup;
  submittedInvoice: boolean = false;
  formErrorsInvoice: any;
  invoiceSaved: boolean = false;

  addBookingForm!: FormGroup;
  formErrorsAddBooking: any;
  submittedAddBookingForm: boolean = false;

  public payment: Payment = Payment.default()

  paymentMode: PaymentModePayment = PaymentModePayment.default()
  formValid: PaymentModePayment = PaymentModePayment.default()

  cash: Cash = Cash.default();
  card: Edc = Edc.default();
  digitalPayment: Digital_Payment = Digital_Payment.default();
  bankTransfer: Bank_Transfer = Bank_Transfer.default();
  qris: Qris = Qris.default();
  giro: Giro = Giro.default();
  payer: Payer = Payer.default()

  paymentModes: string = '';
  paymentModeList: PaymentMode[] = [];
  cashValid: boolean = false;
  selectedPaymentMode: any

  public paymentSettle: Payment_Settlement[] = [Payment_Settlement.default()]
  loadPrepaidPaymentSettle: boolean = false

  public readOnlyAmount: boolean = true
  public readOnlyPaymentMode: boolean = true
  public readOnlyAmountToSettled : boolean = true
  public readOnlySettleAmount : boolean = true
  public readOnlyBalance : boolean = true
  public readOnlyDeposit : boolean = true
  public readOnlyBank : boolean = true
  public readOnlyNet : boolean = true

  public disabledAdd: boolean = false
  public disabledSave: boolean = true
  public disabledCancel: boolean = true
  public disabledSaveInvoice: boolean = true
  public disabledDiscountFactor: boolean = false
  public progress: boolean = false;

  progressExport: boolean = false
  progressDoctor: boolean = false
  progressTimeSlot: boolean = false
  progressTimeSlotCovidTesting: boolean = false
  exportParams: any
  showCardBookingInformation: boolean = false
  showCardInvoice: boolean = false
  showCardPayment: boolean = false
  showCardPaymentSettlement: boolean = false

  isOpdSelected: boolean = false
  opdDetail: OpdDetail = OpdDetail.default()
  timeSlotList: TimeSlot[] = []
  timeSlotDateList: TimeSlotList[] = []
  enabledAppointmentDates: Date[] = []
  mcuUnavailableDateList: string[] = []
  disabledMcuDate: Date[] = []

  selectedAppointmentTimeSlot: any = {}
  isTeleconsultation: boolean = false
  isTimeUnavailable: boolean = false

  bsModalUserValidation?: BsModalRef;
  isUserValid: boolean = false
  loadingAddButton: boolean = false

  showWarningCovidTestingType: boolean = false
  showWarningAppointmentDate: boolean = false
  showWarningAppointmentTime: boolean = false
  resetAddBookingForm: boolean = false

  bsModalShowAlert?: BsModalRef
  date: Date = new Date()
  bsModalShowAlertConfirm?: BsModalRef
  appsToDisabled: any

  nationality_id: number = 0

  constructor(private bsModalService : BsModalService,
    public bookingPaymentRepository: BookingPaymentRepository,
    private token: TokenStorageService,
    private fb: FormBuilder,
    private vf: BookingPaymentValidationFormsService,
    private alertService: ModalAlertService) { 
      this.formErrors = this.vf.errorMessages
      this.formErrorsInvoice = this.vf.errorInvoiceMessages
      this.formErrorsAddBooking = this.vf.errorAddBookingMessages
      bookingPaymentRepository.component = this
    }

  ngOnInit(): void {
    this.createForm()
    this.disabledAddBookingForm()

    const userData = this.token.getUserData();
    this.hospital_id = userData.mobile_organization_id;
    this.org_id = userData.hope_organization_id;
    this.hospital_hope_id = userData.hope_organization_id;
    this.payload.org_id = this.org_id;
    this.covidTestDetail.hospital_id = this.hospital_id
    this.covidTestDetail.hospital_hope_id = this.hospital_hope_id
    this.covidTestDetail.country_code = '+62'
    
    this.bookingPaymentRepository.getList()
    this.bookingPaymentRepository.getSpecialist()
    this.bookingPaymentRepository.getDoctorList();
    this.bookingPaymentRepository.getCovidTestingTypeList()
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

  getPatientEvent(e: any) {
    var dob = e.dob
    const splitDob = dob.split('T')

    this.patient = e
    this.patientId = e.patient_id!;
    this.payload.id_no = this.patient.id_no!
    this.payload.contact_no = this.patient.contact_no!
    this.patient.dob = splitDob[0]
    this.payload.dob = splitDob[0]
    this.payload.email = this.patient.email!
    this.payload.patient_name = this.patient.patient_name!
    this.payload.mr_no = this.patient.mr_no!
    this.payload.address = this.patient.address!
    this.payload.sex = this.patient.sex!
    this.payload.patient_id = this.patient.patient_id!

    if(this.nationality_id == 0){
      this.nationality_id = this.patient.nationality_id!
    }
  }

  getMOEvent(e: any){
    this.payload.sales_item_id = e.sales_item_id
    this.payload.sales_item_name = e.sales_item_name
    this.payload.doctor = e.doctor_name
    this.payload.appointment_date = e.future_order_date
    this.payload.appointment_time_from = e.future_order_time
    this.payload.amount = e.quantity
    this.payload.medical_order_id = e.cpoe_trans_id
    this.payload.service_id = 4
    this.payload.service_name = 'OPD'
    this.bookingPaymentRepository.getItemStockandPrice()
    // this.onAddData()
  }

  resetData(){
  this.package = Package.default()
  this.selectedAppointmentTimeCovidTesting = CovidTestingSchedule.default()
  this.selectedService = {key: '', value: ''}
  this.selectedSpecialization = Specialization.default()
  this.selectedDoctor = Doctor.default()
  this.selectedAppointmentDate = {}
  this.selectedAppointmentTime = {}
  this.selectedCovidTestingType = {}
  this.payload = {
    org_id: this.org_id,
    schedule_id: '',
    medical_order_id: '',
    appointment_no: 0,
    appointment_date: '',
    appointment_time_from: '',
    appointment_time_to: '',
    doctor: '',
    contact_no: this.patient.contact_no!,
    dob: this.patient.dob!,
    email: this.patient.email!,
    patient_name: this.patient.patient_name!,
    patient_id: this.patient.patient_id!,
    address: this.patient.address!,
    contact_id: '',
    id_no: this.patient.patient_id!.toString(),
    mr_no: this.patient.mr_no!,
    sales_item_id: 0,
    sales_item_name: '',
    service_id: 0,
    service_name: '',
    covid_testing_type_id: '',
    covid_testing_type_name: '',
    price: 0,
    amount: 1,
    booking_id: '',
    uuid: '',
    sex: this.patient.sex!
  }
  this.typePackage = ''
  this.isCovidSelected = false
  this.isOpdSelected = false
  this.timeSlotList = []
  this.selectedAppointmentTimeSlot = {}
  this.isTeleconsultation = false
  this.isTimeUnavailable = false
  this.opdDetail = OpdDetail.default()
  this.readPackage = true
  }

  onCheckPatient(selected: any){
    if(this.patientId==0){
      this.alertService.showModalAlert("Select patient first",ALERT_WARNING)
      this.createAddBookingForm()
    }else{
      this.onChangeService(selected)
    }
  }

  reset(){
    this.fab["covidTestingType"].reset()
    this.fab["specialization"].reset()
    this.fab["doctor"].reset()
    this.fab["appointmentDate"].reset()
    this.fab["appointmentTime"].reset()
    this.fab["appointmentTimeSlot"].reset()
    this.fab["appointmentTimeCovidTesting"].reset()

  }

  onChangeService(selected: any){
    this.resetData()
    this.resetAddBookingForm = true
    this.reset()
    // this.reset() //reset form terlebih dahulu
    switch(selected.key){
      case MCU:
        this.selectedService = selected
        this.payload.service_id = parseInt(selected.key)
        this.payload.service_name = selected.value
        this.readPackage = false
        this.readCovidTestingType = true
        this.readSpecialization = true
        this.readDoctorName = true
        this.disabledViewSchedule = true
        this.readAppointmentTime = true
        this.isCovidSelected = false
        this.isOpdSelected = false
        this.typePackage = 'mcu'
        this.serviceType = this.selectedService.value
        this.disabledAppointmentDate = true
        this.addBookingForm.controls['covidTestingType'].disable();
        this.addBookingForm.controls['specialization'].disable();
        this.addBookingForm.controls['doctor'].disable();
        this.addBookingForm.controls['appointmentDate'].enable();
        this.addBookingForm.controls['appointmentTime'].disable();
        this.addBookingForm.controls['appointmentTimeSlot'].disable();
        this.addBookingForm.controls['appointmentTimeCovidTesting'].disable();
        break;

      case COVID_TESTING:
        this.selectedService = selected
        this.payload.service_id = parseInt(selected.key)
        this.payload.service_name = selected.value
        this.readPackage = false
        this.readCovidTestingType = false
        this.readSpecialization = true
        this.readDoctorName = true
        this.disabledViewSchedule = false
        this.readAppointmentTime = true
        this.isCovidSelected = true
        this.isOpdSelected = false
        this.typePackage = 'covid'
        this.serviceType = this.selectedService.value
        this.disabledAppointmentDate = true
        this.addBookingForm.controls['covidTestingType'].enable();
        this.addBookingForm.controls['specialization'].disable();
        this.addBookingForm.controls['doctor'].disable();
        this.addBookingForm.controls['appointmentTime'].disable();
        this.addBookingForm.controls['appointmentDate'].disable();
        this.addBookingForm.controls['appointmentTimeSlot'].disable();
        this.addBookingForm.controls['appointmentTimeCovidTesting'].enable();
        this.resetAddBookingForm = false
        break;

      // case TELECONSULTATION:
      //   this.isTeleconsultation = true
      //   this.readPackage = true
      //   this.readCovidTestingType = true
      //   this.readSpecialization = false
      //   this.readDoctorName = false
      //   this.disabledViewSchedule = false
      //   this.readAppointmentTime = false
      //   this.isCovidSelected = false
      //   this.isOpdSelected = false
      //   this.typePackage = ''
      //   this.serviceType = this.selectedService.value
      //   break;

      case OPD:
        this.selectedService = selected
        this.payload.service_id = parseInt(selected.key)
        this.payload.service_name = selected.value
        this.isTeleconsultation = false
        this.readPackage = true
        this.readCovidTestingType = true
        this.readSpecialization = false
        this.readDoctorName = false
        this.disabledViewSchedule = false
        this.readAppointmentTime = false
        this.isCovidSelected = false
        this.isOpdSelected = true
        this.typePackage = 'opd'
        this.serviceType = this.selectedService.value
        this.disabledAppointmentDate = true
        this.addBookingForm.controls['covidTestingType'].disable();
        this.addBookingForm.controls['specialization'].enable();
        this.addBookingForm.controls['doctor'].enable();
        this.addBookingForm.controls['appointmentTime'].enable();
        this.addBookingForm.controls['appointmentDate'].enable();
        this.addBookingForm.controls['appointmentTimeSlot'].enable();
        this.addBookingForm.controls['appointmentTimeCovidTesting'].disable();
        break;
    }
  }

  onChangeCovidTestingType(selected: CovidTestingType) {
    if(selected!=null){
      if(this.payload.sales_item_id==0){
        if(!this.resetAddBookingForm){
          this.showWarningCovidTestingType = true
          this.fab["covidTestingType"].reset()
          this.selectedCovidTestingType = {}
        }
      }else{
        this.disabledAppointmentTimeCovid = true
        this.selectedCovidTestingType = selected
        this.payload.covid_testing_type_id = selected.siloam_service_id
        this.payload.covid_testing_type_name = selected.name
        this.isDriveThru = selected.is_drive_thru
        this.covidTestDetail.form_type_id = selected.siloam_service_id
        this.covidTestDetail.form_type = selected.name
        this.covidTestDetail.is_drive_thru = selected.is_drive_thru
        this.bookingPaymentRepository.getCovidTestingSchedule()
      }
    }
  }

  onChangeCovidTestingSchedule(selected: CovidTestingSchedule) {
    if(selected!=null){
      this.selectedAppointmentTimeCovidTesting = selected
      this.payload.schedule_id = selected.checkup_schedule_id
      this.payload.appointment_time_from = selected.from_time
      this.payload.appointment_time_to = selected.to_time
      this.payload.appointment_date = selected.checkup_date
      this.covidTestDetail.hope_sales_item_category = selected.checkup_name
      this.covidTestDetail.hope_sales_item_category_id = selected.checkup_id
      this.covidTestDetail.checkup_type_id = selected.checkup_type_id
    }
  }

  onChangeSpecialization(selected: any) {
    this.fab["doctor"].reset();
    this.selectedDoctor = Doctor.default()

    if(selected!=null){
      this.selectedSpecialization = selected
      this.readDoctorName = true
      this.bookingPaymentRepository.getDoctorList()
    }
  }

  onChangeDoctor(selected: Doctor) {
    this.fab["appointmentDate"].reset();
    this.selectedAppointmentDate = null;
    

    this.listScheduledDoctor = []

    this.fab["appointmentTime"].reset();
    this.listAppointmentTime = []
    
    this.fab["appointmentTimeSlot"].reset();
    this.timeSlotList = []

    this.disabledAppointmentDate = true

    if(selected!=null){
      this.selectedDoctor = selected
      this.payload.doctor = selected.name
      this.payload.price = selected.consultation_price
      this.opdDetail.doctor_id = selected.doctor_id
      this.opdDetail.hospital_id = this.hospital_id
      //this.disabledAppointmentDate = true
      this.bookingPaymentRepository.getScheduledDoctor(this.selectedService.key)
      this.bookingPaymentRepository.getTimeSlot();
      this.disabledAppointmentDate = false
    }
  }

  onChangeAppointmentDate(selected: any) {
    if(selected!=null){
      selected = formatDate(selected, "yyyy-MM-dd", "en-US");
      if(this.selectedService.key==OPD){
        if(this.selectedDoctor.doctor_id == ''){
          this.showWarningAppointmentDate = true
          this.selectedAppointmentDate = {}
          this.fab['appointmentDate'].reset()
        }else{
          this.saveAppointmentDate(selected)  
        }
      }else{
        this.saveAppointmentDate(selected)
      }
    }
  }

  saveAppointmentDate(selected: any){
    if(selected!=null){
      this.selectedAppointmentDate = selected
      this.payload.appointment_date = selected
      var date = new Date(selected);
      this.day = date.toLocaleDateString('en-US', { weekday: 'long' })
      this.listAppointmentTime = this.listScheduledDoctor.filter(x => x.day_name == this.day)
    }
  }

  onChangeAppointmentTime(selected: any) {
    if(selected!=null){
      if(this.selectedAppointmentDate==''){
        this.showWarningAppointmentTime = true
        this.fab['appointmentTime'].reset()
        this.selectedAppointmentTime = {}
      }else{
        this.selectedAppointmentTime = selected
        if(this.selectedService.key==OPD){
          this.disabledAppointmentTimeSlot = true

          this.payload.schedule_id = selected.schedule_id

          let date = new Date(this.selectedAppointmentDate);
          let formatted = formatDate(date, "yyyy-MM-dd", "en-US")
          let dateList = this.timeSlotDateList.find(t => t.date == formatted);
          if (dateList != null) {
            this.timeSlotList = dateList.time_slot.filter(t => t.schedule_id == selected.schedule_id)
          }
          this.disabledAppointmentTimeSlot = false
        }else{
          this.payload.appointment_time_from = selected.from_time
          this.payload.appointment_time_to = selected.to_time
          this.payload.schedule_id = selected.schedule_id
        }
      }
    }
  }

  onChangeAppointmentTimeSlot(selected: TimeSlot) {
    if(selected!=null){
      if(this.selectedAppointmentTime.key==''){
        this.alertService.showModalAlert("Please select appointment time first",ALERT_WARNING)
        this.selectedAppointmentTimeSlot = {}
      }else{
        this.selectedAppointmentTimeSlot = selected
        this.payload.appointment_time_from = selected.schedule_from_time
        this.payload.appointment_time_to = selected.schedule_to_time
        this.payload.schedule_id = selected.schedule_id
        this.payload.appointment_no = selected.appointment_no
      }
    }
  }

  onChangeAppointmentTimeCovidTesting(selected: any) {
    if(selected!=null){
      this.selectedAppointmentTimeCovidTesting = selected
      this.payload.appointment_time_from = selected.from_time
      this.payload.appointment_time_to = selected.to_time
      this.payload.schedule_id = selected.schedule_id
    }
  }

  changeInputBooking(e: any) {
    this.selectedInputBooking = e.target.value
  }

  showSendPrintModal() : void {
    const initialState: ModalOptions = {
      initialState: {
        whatsapp: this.patient.contact_no,
        email: this.patient.email,
        type: 'prepaid',
        id: this.prepaidId
      },
    };
    this.bsModalSendPrint = this.bsModalService.show(ModalSendPrintComponent, Object.assign(ModalLargeConfig, initialState))
  }

  showSendPrintTemporaryModal() : void {
    const initialState: ModalOptions = {
      initialState: {
        whatsapp: this.patient.contact_no,
        email: this.patient.email,
        type: 'prepaid',
        id: this.prepaidId,
        print_type: 'sementara',
        prepaid_list: this.bookingInformation, 
        nationality_id: this.nationality_id,
        discount: this.discountAmount
      },
    };
    this.bsModalSendPrint = this.bsModalService.show(ModalSendPrintComponent, Object.assign(ModalLargeConfig, initialState))
  }

  onClickNewBooking(){
    if(this.selectedInputBooking == "automatic"){
      this.bookingPaymentRepository.getDataMedicalOrder()
      this.showInputManually = false;
      this.showTableMedicalOrder = true;
      this.showFooter = false
    }else{
      this.showInputManually = true;
      this.showTableMedicalOrder = false;
      this.showFooter = true
    }
  }

  onClickSearchPackage(){
    if(this.typePackage=='opd'){
      this.bsModalRef = this.bsModalService.show(ModalSearchSalesItemComponent, ModalLargeConfig);

      this.bsModalRef.content.selectedItem.subscribe((data: any) => {
        this.package = data;
        this.payload.sales_item_id = this.package.sales_item_id
        this.payload.sales_item_name = this.package.sales_item_name
        this.bookingPaymentRepository.getItemStockandPrice()
      })
    }else{
      const initialState: ModalOptions = {
        initialState: {
          typePackage: this.typePackage
        },
      };
  
      this.bsModalRef = this.bsModalService.show(ModalPackageComponent, Object.assign(ModalLargeConfig, initialState));
      
      this.bsModalRef.content.selectPackageEvent.subscribe((data: Package | any) => {
        this.package = data;
        this.payload.sales_item_id = this.package.sales_item_id
        this.payload.sales_item_name = this.package.sales_item_name
        this.payload.price = this.package.price
        this.checkupIdCovidTesting = this.package.hope_sales_item_category_id

        if (this.typePackage == 'mcu') this.bookingPaymentRepository.getMcuUnavailableDate();
      })
    }
  }

  onClickViewSchedule(){
    if(this.selectedService.key==COVID_TESTING){
      const params = new HttpParams()
      .set('is_drive_thru',this.selectedCovidTestingType.is_drive_thru)
      .set('sales_item_id',this.payload.sales_item_id)
      .set('hospital_id',this.hospital_id)
    }
    const initialState: ModalOptions = {
      initialState: {
        scheduleData: this.listScheduledDoctor
      },
    };

    this.bsModalRefViewSchedule = this.bsModalService.show(ModalViewScheduleDoctorComponent, Object.assign(ModalLargeConfig, initialState));
  }

  async onAddData(){
    this.submittedAddBookingForm = true;
    if(this.addBookingForm.valid){
      var uuid = uuidv4()
      this.payload.uuid = uuid
      
      if(this.selectedService.key==COVID_TESTING){
        this.payload.covid_test_detail = this.covidTestDetail
      }
      if(this.bookingInformation.length==0){
        if(this.selectedService.key==MCU){
          this.loadingAddButton = true
          this.disabledAddBooking = true
          let result = await this.bookingPaymentRepository.checkIfMcuAvailableDate()
          if(result){
            this.alertService.showModalAlert("Cannot add a new booking because the date is not available",ALERT_WARNING)
          }else{
            this.bookingInformation.push(this.payload)
            this.showCardBookingInformation = true
            this.resetData()
            this.createAddBookingForm()
          }
        }else if(this.selectedService.key==OPD){
          this.payload.opd_detail = this.opdDetail
          this.bookingInformation.push(this.payload)
          this.showCardBookingInformation = true
          this.resetData()
          this.createAddBookingForm()
        }else{
          this.bookingInformation.push(this.payload)
          this.showCardBookingInformation = true
          this.resetData()
          this.createAddBookingForm()
        }
      }else{
        if(this.selectedService.key==OPD){
          this.payload.opd_detail = this.opdDetail
          
          
          if (this.payload.service_id != this.bookingInformation[0].service_id){
            this.alertService.showModalAlert("For OPD Service, you can only create one appointment",ALERT_WARNING)
            this.resetData()
            this.createAddBookingForm()
          }else{
            this.bookingInformation.push(this.payload)
            this.showCardBookingInformation = true
            this.resetData()
            this.createAddBookingForm()
          }
        }else if(this.selectedService.key==MCU){
          this.loadingAddButton = true
          this.disabledAddBooking = true
          let result = await this.bookingPaymentRepository.checkIfMcuAvailableDate()
          if(result){
            this.alertService.showModalAlert("Cannot add a new booking because the date is not available",ALERT_WARNING)
          }else{
            if (this.payload.service_id != this.bookingInformation[0].service_id){
              this.alertService.showModalAlert("Cannot add a new booking which its service type is different from the existing service in the booking table",ALERT_WARNING)
              this.resetData()
              this.createAddBookingForm()
            }else{
              this.bookingInformation.push(this.payload)
              this.showCardBookingInformation = true
              this.resetData()
              this.createAddBookingForm()
            }
          }
        }else{
          if (this.payload.service_id != this.bookingInformation[0].service_id){
            this.alertService.showModalAlert("Cannot add a new booking which its service type is different from the existing service in the booking table",ALERT_WARNING)
            this.resetData()
            this.createAddBookingForm()
          }else{
            this.bookingInformation.push(this.payload)
            this.showCardBookingInformation = true
            this.resetData()
            this.createAddBookingForm()
          }
        }
      }
    };
  }

  removeData(uuid: string){
    for (var i = 0; i < this.bookingInformation.length; i++){
      if(this.bookingInformation[i].uuid==uuid){
        delete this.bookingInformation[i]
        this.bookingInformation = this.bookingInformation.filter(e=>{return e != undefined})
      }
    }
    
  }

  async showModalUserValidation(typeTransaction: string, body?: any){
    this.bsModalUserValidation = this.bsModalService.show(ModalValidasiUserComponent, ModalLargeConfig)

    this.bsModalUserValidation.content.isUserValid.subscribe((data: Package | any) => {
      if(data){
        if(typeTransaction=='booking_information'){
          this.saveBookingInformation()
        }else if(typeTransaction=='invoice'){
          this.savePrepaidInvoice()
        }else if(typeTransaction=='payment'){
          this.bookingPaymentRepository.savePayment(body)
        }
      }else{
        this.alertService.showModalAlert("User not valid",ALERT_WARNING)
      }
    })
  }

  async onSaveBookingInformation(){
    this.showModalConfirm('Are you sure you want to save this appointment?').subscribe((item: any)=>{
      this.saveBookingInformation()
    })
  }

  saveBookingInformation(){
    this.bookingPaymentRepository.saveBookingInformation();
    this.loadSaveBookingInformation = true
    this.loadInvoiceCard = true
  }

  queryInputs() {
    const apps = this.appsToDisabled

    for (const app in apps) {
      const inputs: any[] = apps[app].querySelectorAll("input");
      const selects: any[] = apps[app].querySelectorAll("select");
      const buttons: any[] = apps[app].querySelectorAll("button");

      inputs.forEach(input => {
        this.inputs.push(input);
      });
      selects.forEach(select => {
        this.inputs.push(select);
      })
      buttons.forEach(button => {
        this.inputs.push(button);
      })
    }

    this.inputs.forEach(input => {
        input.disabled = true;
    })
  }
    
  onChangeDiscountType(e: any){
    this.selectedDiscountType = e
    if(e.key=='1'){
      this.discountAmount = 0
      this.discountFactor = 0
      this.net = this.gross
      this.balance = this.net
      this.disabledDiscountFactor = true
    }else{
      this.disabledDiscountFactor = false
      this.discountAmount = 0
      this.discountFactor = 0
    }
  }

  onChangeDiscountFactor(e: any){
    this.discountFactor = e
    switch(this.selectedDiscountType.key){
      case '2':
        this.net = this.gross - (this.discountFactor / 100 * this.gross)
        this.discountAmount = this.discountFactor / 100 * this.gross
        break

      case '4':
        this.net = this.gross - this.discountFactor
        this.discountAmount = this.discountFactor
        break

      // case '5':
      //   break
    }
    this.balance = this.net
  }

  onValidateSaveInvoice() {
    this.submittedInvoice = true;
    if (this.invoiceForm.valid) this.showModalUserValidation('invoice');
  }

  onSavePrepaidInvoice(){
    this.showModalConfirm('Are you sure you want to save this invoice?').subscribe((item: any)=>{
      this.savePrepaidInvoice()
    })
  }

  savePrepaidInvoice(){
    this.bookingPaymentRepository.savePrepaidInvoice();
    this.loadSaveInvoiceButton = true
  }

  createAddBookingForm(){
    this.submittedAddBookingForm = false
    this.addBookingForm = this.fb.group({
      service: ['', [Validators.required]],
      covidTestingType: ['', [Validators.required]],
      specialization: [''],
      doctor: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      appointmentTime: ['', [Validators.required]],
      appointmentTimeSlot: ['', [Validators.required]],
      appointmentTimeCovidTesting: ['', [Validators.required]],
    })

    this.disabledAddBookingForm()
  }

  createForm() {
    this.paymentForm = this.fb.group({
      amount: [this.payment.amount, 
        [
          Validators.required,
          (control: AbstractControl) => Validators.max(this.payment.balance)(control)
        ]],
      paymentMode: ['', [Validators.required]]
    })

    this.invoiceForm = this.fb.group({
      discountType: ['', [Validators.required]],
      discountFactor: [0, [Validators.pattern(/^-?\d*[.]?\d{0,4}$/)]],
    })

    this.addBookingForm = this.fb.group({
      service: ['', [Validators.required]],
      covidTestingType: ['', [Validators.required]],
      specialization: [''],
      doctor: ['', [Validators.required]],
      appointmentDate: ['', [Validators.required]],
      appointmentTime: ['', [Validators.required]],
      appointmentTimeSlot: ['', [Validators.required]],
      appointmentTimeCovidTesting: ['', [Validators.required]],
    })
  }

  disabledAddBookingForm(){
    this.addBookingForm.controls['covidTestingType'].disable();
    this.addBookingForm.controls['specialization'].disable();
    this.addBookingForm.controls['doctor'].disable();
    this.addBookingForm.controls['appointmentDate'].disable();
    this.addBookingForm.controls['appointmentTime'].disable();
    this.addBookingForm.controls['appointmentTimeSlot'].disable();
    this.addBookingForm.controls['appointmentTimeCovidTesting'].disable();
  }

  get f() {
    return this.paymentForm.controls;
  }

  get fab() {
    return this.addBookingForm.controls
  }

  isFormAddBookingError(formName: string,) {
    return this.submittedAddBookingForm && this.fab[formName].errors;
  }

  isFormAddBookingValid(formName: string) {
    return { 'is-invalid': this.submittedAddBookingForm && this.fab[formName].errors, 
              'is-valid': this.submittedAddBookingForm && this.fab[formName].errors }
  }

  getErrorsAddBooking(formName: string): any {
    return this.fab[formName].errors;
  }

  getErrorMessageAddBooking(formName: string, error: any): string {
    return this.formErrorsAddBooking[formName][error];
  }

  isFormError(formName: string) {
    return this.submitted && this.f[formName].errors;
  }

  isFormValid(formName: string) {
    return { 'is-invalid': this.submitted && this.f[formName].errors, 
              'is-valid': this.submitted && this.f[formName].errors }
  }

  getErrors(formName: string): any {
    return this.f[formName].errors;
  }

  getErrorMessage(formName: string, error: any): string {
    return this.formErrors[formName][error];
  }

  get fi() {
    return this.invoiceForm.controls;
  }

  isFormInvoiceError(formName: string) {
    return (this.submittedInvoice || this.fi[formName].touched) && this.fi[formName].errors;
  }

  isFormInvoiceValid(formName: string) {
    return { 
      'is-invalid': (this.submittedInvoice || this.fi[formName].touched) && this.fi[formName].errors,
      'is-valid': (this.submittedInvoice || this.fi[formName].touched) && !this.fi[formName].errors
    }
  }

  getInvoiceErrors(formName: string): any {
    return this.fi[formName].errors;
  }

  getInvoiceErrorMessage(formName: string, error: any): string {
    return this.formErrorsInvoice[formName][error];
  }

  onChangePaymentAmount(amount: any) {
    if (isNaN(amount)) {
      amount = 0
    }
    const newPayment: Payment = {...this.payment};
    newPayment.amount = amount;
    newPayment.net = amount;
    this.payment = newPayment;
  }

  onChangePaymentMode(selection: any) {
    this.submitted = false;
    if (selection == null) selection = { key: '', value: '' }
    this.selectedPaymentMode = selection;
    switch(selection.key){
      // Cash
      case "1":
        this.displayPaymentMode("cash");
        break;
      // Debit Card
      case "3":
      // Credit Card
        this.displayPaymentMode("edc");
        break;
      case "2":
        this.displayPaymentMode("edc");
        break;
      // Additional Payer
      case "9":
        this.displayPaymentMode("payer");
        break;
      // Digital Payment
      case "10":
        this.displayPaymentMode("digitalPayment");
        break;
      // Bank Transfer
      case "6":
        this.displayPaymentMode("bankTransfer");
        break;
      // Cheque
      case "4":
        this.displayPaymentMode("giro");
        break;
      default:
        this.displayPaymentMode("");
        break;
    }
  }

  displayPaymentMode(paymentModeName: string) {
    let paymentMode: any = {...this.paymentMode}
    for (const prop in paymentMode) {
      if (prop == paymentModeName) paymentMode[prop] = true;
      else paymentMode[prop] = false;
    }
    this.paymentMode = paymentMode;
  }

  
  getPrepaidSettle(){
    this.paymentSettlementParams = this.paymentSettlementParams
    .set('transaction_no',this.prepaidId)
    .set('transaction_type','Prepaid')
    .set('org_id', this.org_id)
    .set('page_no',1)
  }

  addPaymentMode(): void {
    this.readOnlyAmount = false
    this.readOnlyPaymentMode = false;

    this.disabledAdd = true;
    this.disabledCancel = false;
    this.disabledSave = false;

    this.paymentForm.controls["amount"].setValue(this.payment.balance)
  }

  cancelAddPaymentMode(): void {
    this.readOnlyAmount = true;
    this.readOnlyPaymentMode = true;
    this.readOnlyAmountToSettled = true;
    this.readOnlySettleAmount = true;
    this.readOnlyBalance = true;
    this.readOnlyDeposit = true;
    this.readOnlyBank = true;
    this.readOnlyNet = true;

    this.disabledAdd = false;
    this.disabledCancel = true;
    this.disabledSave = true;

    this.submitted = false;
    this.paymentForm.reset();
  }

  submitAddPayment(){
    this.submitted = true
    var valid: boolean = false
    let body: SavePaymentPrepaidRequest = {
      prepaid_id: this.prepaidId,
      payment_mode_id: Number(this.selectedPaymentMode.key),
      amount: this.payment.amount,
      balance: this.payment.balance,
      notes: "",
    }
    if (this.paymentForm.valid) {
      switch (this.selectedPaymentMode.key) {
        case '1':
          SavePaymentUtils.cash(this.formValid, body, this.cash);
          valid = this.formValid.cash
          break;
        case '2':
          SavePaymentUtils.creditCard(this.formValid, body, this.card);
          valid = this.formValid.edc
          break;
        case '3':
          SavePaymentUtils.debitCard(this.formValid, body, this.card);
          valid = this.formValid.edc
          break;
        case '4':
          SavePaymentUtils.chequeGiro(this.formValid, body, this.giro);
          valid = this.formValid.giro
          break;
        case '6':
          SavePaymentUtils.bankTransfer(this.formValid, body, this.bankTransfer);
          valid = this.formValid.bankTransfer
          break;
        case '9':
          SavePaymentUtils.additionalPayer(this.formValid, body, this.payer);
          valid = this.formValid.payer
          break;
        case '10':
          SavePaymentUtils.digitalPayment(this.formValid, body, this.digitalPayment, 
            this.patient);
            valid = this.formValid.digitalPayment
          break;
        case '11':
          SavePaymentUtils.qris(this.formValid, body, this.qris, this.patient);
          valid = this.formValid.qris
          break;
      }
      if (this.paymentForm.valid && valid) {
        this.showModalConfirm('Are you sure you want to save this payment?').subscribe((item: any)=>{
          this.showModalUserValidation('payment',body)
        })
      }
    }
  }



}
