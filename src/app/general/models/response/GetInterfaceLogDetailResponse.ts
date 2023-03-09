import { GlobalResponse } from "../GlobalResponse";

export interface GetInterfaceLogDetailResponse extends GlobalResponse{
  batch_id: string,
  org_id: number,
  log_id: string,
  interface_type: string,
  process_date: string,
  endpoint: string,
  status: string,
  request_message: string,
  request_time: string,
  response_message: string,
  transaction_type: string,
}

export class GetInterfaceLogDetailResponse {
  static default(): GetInterfaceLogDetailResponse {
    return {
      batch_id: '',
      org_id: 0,
      log_id: '',
      interface_type: '',
      process_date: '',
      endpoint: '',
      status: '',
      request_message: '',
      request_time: '',
      response_message: '',
      transaction_type: '',
    }
  }
}
