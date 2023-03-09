import { GlobalResponse } from "../GlobalResponse";
import { InvoiceList } from "../InvoiceList";
import { Paging } from "../Paging";

export interface GetInvoiceListResponse extends GlobalResponse{
   invoice_list: InvoiceList[],
   paging: Paging
}