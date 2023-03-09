import { CovidTestDetail } from "./CovidTestDetail"
import { OpdDetail } from "./OpdDetail"

export interface BookingInformation{
   schedule_id: string
   medical_order_id: string
   appointment_date: string
   appointment_time_from: string
   appointment_time_to: string
   appointment_no: number
   doctor: string
   org_id: number
   contact_no: string
   dob: string
   email: string
   patient_name: string
   patient_id: number
   address: string
   contact_id: string
   id_no: string
   mr_no: number
   sales_item_id: number
   sales_item_name: string
   service_id: number
   service_name: string
   covid_testing_type_id: string
   covid_testing_type_name: string
   price: number
   amount: number
   booking_id: string
   covid_test_detail?: CovidTestDetail
   opd_detail?: OpdDetail
   uuid: string,
   sex: string,
}

export class BookingInformation{
   static default(): BookingInformation{
      return{
         org_id: 0,
         schedule_id: '',
         medical_order_id: '',
         appointment_no: 0,
         appointment_date: '',
         appointment_time_from: '',
         appointment_time_to: '',
         doctor: '',
         contact_no: '',
         dob: '',
         email: '',
         patient_name: '',
         patient_id: 0,
         address: '',
         contact_id: '',
         id_no: '',
         mr_no: 0,
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
         sex: ''
      }
   }
}