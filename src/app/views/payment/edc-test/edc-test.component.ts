import { Component, OnInit } from '@angular/core';
import { RESPONSE_SUCCESS } from 'src/app/_configs/app-config';
import { EdcList } from 'src/app/general/models/EdcList';
import { EdcParseMessageResponse } from 'src/app/general/models/response/EdcParseMessageResponse';
import { EdcService } from 'src/app/service/edc.service';
import { EdcBniTestRepository } from './edc-bni-test-repository.service';
import { EdcCimbTestRepository } from './edc-cimb-test-repository.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ComboBox } from 'src/app/general/models/ComboBox';
import { EdcParseMessageRequest } from 'src/app/general/models/request/EdcParseMessageReq';
import { EdcGenerateMessageResponse } from 'src/app/general/models/response/EdcGenerateMessageResponse';
import { ModalAlertService } from 'src/app/service/modal-alert.service';
import { SerialPort } from 'src/app/_helpers/edc';

@Component({
  selector: 'app-edc-test',
  templateUrl: './edc-test.component.html',
  styleUrls: ['./edc-test.component.scss']
})
export class EdcTestComponent implements OnInit {

  progress: boolean = false

  listEdc: EdcList[] = [{
    edc_id: 1,
    edc_name: "BNI - ECR Testing",
    usb_product_id: "0x0028",
    usb_vendor_id: "0x079B",
    baudrate: 9600,
    databits: 8,
    stopbits: 1,
    parity: "none",
    generate_message_url: "/api/edcbni/generateMessage",
    parse_message_url: "/api/edcbni/parseMessage",
    bank_id: 1,
    is_integrated: "Y"
  },
  {
    edc_id: 2,
    edc_name: "CIMB - ECR Testing",
    usb_product_id: "0x0055",
    usb_vendor_id: "0x0B00",
    baudrate: 9600,
    databits: 8,
    stopbits: 1,
    parity: "none",
    generate_message_url: "/api/edccimb/generateMessage",
    parse_message_url: "/api/edccimb/parseMessage",
    bank_id: 1,
    is_integrated: "Y"
  },
  {
    edc_id: 3,
    edc_name: "BCA - ECR Testing",
    usb_product_id: "0x0053",
    usb_vendor_id: "0x0B00",
    baudrate: 9600,
    databits: 8,
    stopbits: 1,
    parity: "none",
    generate_message_url: "/api/edcbni/generateMessage",
    parse_message_url: "/api/edcbni/parseMessage",
    bank_id: 1,
    is_integrated: "Y"
  }]
  listCardType: ComboBox[] = [
    {
      "key": "2",
      "value": "Credit Card"
    },
    {
      "key": "3",
      "value": "Debit Card"
    }
  ]

  selectedEdc: EdcList = EdcList.default()
  selectedCardType: ComboBox = ComboBox.default()
  amount: number = 0
  edcResponse: string[] = []
  edcMessage: string[] = []
  edcResult: EdcParseMessageRequest = EdcParseMessageRequest.default()

  parseMessageResponse!: EdcParseMessageResponse

  form!: FormGroup
  submitted: boolean = false
  formErrors: any = {
    amount: {
      required: 'Amount is required'
    },
    cardType: {
      required: 'Card Type is required'
    },
    edc: {
      required: 'Please select edc',
    }
  }

  constructor(
    private edcService: EdcService,
    private edcBni: EdcBniTestRepository,
    private edcCimb: EdcCimbTestRepository,
    private fb: FormBuilder,
    private alertService: ModalAlertService
  ) { }

  get f() {
    return this.form.controls;
  }

  ngOnInit(): void {
    this.createForm()
  }

  clean(message: string) {
    return JSON.stringify(message)
  }

  createForm() {
    this.form = this.fb.group({
      amount: ['', [Validators.required]],
      cardType: ['', [Validators.required]],
      edc: ['', [Validators.required]]
    })
  }

  isFormValid(formName: string) {
    return { 'is-invalid': this.submitted && this.f[formName].errors, 
              'is-valid': this.submitted && !this.f[formName].errors }
  }

  isFormError(formName: string) {
    return this.submitted && this.f[formName].errors;
  }

  getErrors(formName: string): any {
    return this.f[formName].errors;
  }

  getErrorMessage(formName: string, error: any): string {
    return this.formErrors[formName][error];
  }

  onChangeAmount(amount: number) {
    this.amount = amount
  }

  onChangeCardType(cardType: ComboBox) {
    this.selectedCardType = cardType
  }

  onChangeEdc(edc: EdcList) {
    
    this.selectedEdc = edc
  }

  onValidateProcess() {
    this.submitted = true;
    if (this.form.valid) this.processEdc()
  }

  async processEdc() {
    this.progress = true
    this.edcMessage = []
    this.edcResponse = []
    this.edcResult = EdcParseMessageRequest.default()

    let message = "";

    switch (this.selectedEdc.edc_id) {
      case 1:
        message = this.edcBni.getMessage(this.amount, this.selectedCardType.value)
        break;
      case 2:
        message = this.edcCimb.getMessage(this.amount, this.selectedCardType.value)
        break;
      default:
        message = this.edcBni.getMessage(this.amount, this.selectedCardType.value)
        break
    }

    let edcMessage: EdcGenerateMessageResponse = EdcGenerateMessageResponse.default()
    edcMessage.message = message
    this.edcMessage.push(message)
    console.log("=== EDC MESSAGE ===")
    console.log(edcMessage.message)
    
    
    let edcResult: EdcParseMessageRequest = EdcParseMessageRequest.default()

    if (!("serial" in navigator)) {
      throw new Error(`The Web serial API doesn\'t seem to be enabled or supported in your browser. 
      Please use Chrome, Edge, or Opera browser.`);
    }

    let port: SerialPort | undefined

    try {
      // Get EDC Port
      
      port = await this.edcService.getEdcPort(this.selectedEdc);

      // Open EDC Port
      
      
      await this.edcService.openEdcPort(port, this.selectedEdc);

      // Write Message to EDC
      
      await this.edcService.writeMessageToEdc(port, edcMessage);
      
      // Read message from EDC
      
      // edcResult = await this.edcService.readMessageFromEdc(port);
      // === START READING MESSAGE ===

      const edcResult: EdcParseMessageRequest = EdcParseMessageRequest.default();
      const reader = port.readable.getReader();

      let run: boolean = true
      let timeout: any;

      while (run) {
        let { value, done } = await reader.read();

        if (done) break
        // === BEFORE IF VALUE ===
        if (value) {
          let decodedValue: string = new TextDecoder("utf-8").decode(value);
          
          this.edcResponse.push(decodedValue) 
          
          
          if (decodedValue.includes("\u0006") || decodedValue.includes("\u0015")) {
            edcResult.response_code += decodedValue;

            if (decodedValue.includes("\u0015")) {
              reader.releaseLock()
              clearTimeout(timeout)
              // break
            }
          } 
          
          if (decodedValue.includes("\u0002")) {
            edcResult.response_desc = decodedValue
          } else {
            edcResult.response_desc += decodedValue
          }

          if (decodedValue.includes("\u0003")) {
            reader.releaseLock()
            clearTimeout(timeout)
            // break;
          }

          timeout = setTimeout(() => {
            reader.cancel()
            reader.releaseLock()
            run = false
          }, 120000);
        
        }
      }

      // Close EDC Port
      
      await port.close();
      this.edcResult = edcResult
    }
    catch (error) {
      if (port != undefined) port.close()
      this.progress = false
      this.alertService.showModalAlertError('An error has occured, please contact administration');
    }

    this.progress = false
  }
}
