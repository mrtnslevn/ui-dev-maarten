export interface EdcList{
   edc_id: number,
   edc_name: string,
   usb_product_id: string,
   usb_vendor_id: string,
   baudrate: number,
   databits: number,
   stopbits: number,
   parity: string,
   generate_message_url: string,
   parse_message_url: string,
   bank_id: number,
   is_integrated: string
}

export class EdcList {
   static default(): EdcList {
      return {
         edc_id: 0, 
         edc_name: '', 
         usb_product_id: '', 
         usb_vendor_id: '',
         baudrate: 0,
         databits: 0,
         stopbits: 0,
         parity: '', 
         generate_message_url: '', 
         parse_message_url: '',
         bank_id: 0,
         is_integrated: ''
      }
   }
}