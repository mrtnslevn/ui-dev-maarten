import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { Payment_Settlement } from "../../models/Payment_Settlement";
import { Paging } from "../../models/Paging";
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap/modal';
import { ModalPaymentTypeComponent } from '../../general-modal/modal-payment-type/modal-payment-type.component';
import { ModalLargeConfig } from 'src/app/_configs/modal-config';
import { PageChangedEvent, PaginationComponent } from 'ngx-bootstrap/pagination';
import { ModalSendPrintComponent } from '../../general-modal/modal-send-print/modal-send-print.component';
import { Patient } from '../../models/Patient';
import { Invoice } from '../../models/Invoice';
import { HttpParams } from '@angular/common/http';
import { PropertyCopier } from 'src/app/_helpers/property-copier';
import { GetPaymentSettlementResponse } from '../../models/response/GetPaymentSettlementResponse';
import { ALERT_DANGER, RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { InvoiceInquiryService } from 'src/app/service/invoice-inquiry.service';
import { Pagination } from 'src/app/_helpers/pagination';
import { ModalAlertService } from 'src/app/service/modal-alert.service';


@Component({
  selector: 'app-card-payment-settlement',
  templateUrl: './card-payment-settlement.component.html',
  styleUrls: ['./card-payment-settlement.component.scss']
})
export class CardPaymentSettlementComponent implements OnInit {

  @ViewChild(PaginationComponent) paginationComp!: PaginationComponent
  @Input() title: string = ''
  @Input() loadPage: boolean = false;
  @Input() show: boolean = true;
  @Input() paging: Paging = new Paging(0, 0, 0, 0, 0);

  current_page = 1;
  page?: number;

  @Input() data: Payment_Settlement[] = [];
  private _params: HttpParams = new HttpParams().set("page_no", 1);
  @Input() set params(params: HttpParams) {
    this._params = params;
    if (params.has("transaction_no") && params.has("transaction_type")) {
      this.pageChanged({page: this.current_page, itemsPerPage: this.paging.rows_per_page})
    }
  }

  @Input() showFooter: boolean = false
  @Input() showPrintOri: boolean = false
  @Input() showPrintCopy: boolean = false
  @Input() printOriManyTimes: boolean = false

  @Input() patientInfo: Patient = Patient.default();
  @Input() type: string = '';
  @Input() invoice: Invoice = Invoice.default();
  @Input() prepaidId: string = ''

  bsModalDetail?: BsModalRef
  bsModal?: BsModalRef;
  bsModalShowAlert?: BsModalRef

  isPrintOriManytimes: boolean = false
  getPaymentSettlementResponse: GetPaymentSettlementResponse | undefined;

  constructor(public bsModalService: BsModalService, 
    private invoiceInquiryService: InvoiceInquiryService,
    private alertService: ModalAlertService) { }

  ngOnInit(): void {
  }

  openDetail(settlementNo: string){
    const initialState: ModalOptions = {
      initialState: {
        settlement_no: settlementNo,
      },
    };
    this.bsModal = this.bsModalService.show(ModalPaymentTypeComponent, Object.assign(ModalLargeConfig, initialState))
  }

  getPaymentSettlement(event?: PageChangedEvent){
    this.loadPage = true;

    return this.invoiceInquiryService.getPaymentSettlement(this._params).subscribe((data: GetPaymentSettlementResponse) => {
      this.getPaymentSettlementResponse = {...data};
      if (this.getPaymentSettlementResponse.response_code == RESPONSE_SUCCESS) {
        this.data = this.getPaymentSettlementResponse.payment_settlement_list;

        this.paging = PropertyCopier.clone(this.getPaymentSettlementResponse.paging, this.paging);

        if (event != undefined) this.page = event.page;
        else if (this.paginationComp != undefined) {
          Pagination.setPaginationComp(this.paging, this.paginationComp)
        }
      } else {
        
        this.alertService.showModalAlert(`Failed to get payment settlement: ${this.getPaymentSettlementResponse.response_desc}`,ALERT_DANGER)
      }
      this.loadPage = false;
    }, err => {
      this.alertService.showModalAlert(`An error has occured while get payment settlement, please contact administration`, ALERT_DANGER)
      this.loadPage = false;
    });
  }

  pageChanged(event: PageChangedEvent): void {
    this._params = this._params.set("page_no", event.page);
    this.getPaymentSettlement(event);
  }

  showSendPrintModal(type: string) {
    
    const initialState: ModalOptions = {
      initialState: {
        modalType: type,
        whatsapp: this.patientInfo.contact_no,
        email: this.patientInfo.email,
        type: this.type,
        id: this.type=='payment' ? this.invoice.invoice_no : this.prepaidId,
        printOriManyTimes: this.isPrintOriManytimes
      },
    };
    this.bsModal = this.bsModalService.show(ModalSendPrintComponent, Object.assign(ModalLargeConfig, initialState));
  }
}
