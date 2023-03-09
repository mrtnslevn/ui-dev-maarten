export interface PrepaidList{
   prepaid_id: string,
   booking_id: string,
   transaction_date: string,
   patient_name: string,
   id_no: string,
   mr_no: number,
   order_id?: any,
   appointment_date: string,
   package_name: string,
   status :string,
   expired_date: string,
   created_by: string
}